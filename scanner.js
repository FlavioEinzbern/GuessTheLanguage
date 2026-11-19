/**
 * ============================================================================
 * WIKIPEDIA API FETCHER, PARAGRAPH PURITY SCANNER & PREFETCH QUEUE
 * ============================================================================
 */

const CJK_LANG_CODES = new Set(['zh', 'yue', 'ja']);

/**
 * Checks if a paragraph contains any forbidden brackets (), {}, or []
 * including full-width CJK brackets.
 */
function hasForbiddenBrackets(text) {
  return /[(){}\[\]（）｛｝［］【】「」『』〔〕〈〉《》]/.test(text);
}

/**
 * Rejects paragraphs that have too many numbers or characters/scripts
 * not commonly used in the selected language.
 * - Counts Unicode combining marks (`\p{M}`) alongside letters (`\p{L}`)
 *   so Indic & Southeast Asian abugidas (Hindi, Bengali, Thai, Khmer, Burmese, etc.)
 *   are not falsely penalized by vowel signs and tone marks.
 * - Uses code-point length and scaled CJK minimums (~110 chars for zh/yue/ja).
 */
function passesLanguagePurityAndNumberCheck(text, langObj, options = {}) {
  const isCjk = CJK_LANG_CODES.has(langObj.code);
  const codePoints = Array.from(text);
  const sample = codePoints.length > 600 ? codePoints.slice(0, 600).join('') : text;

  const nonSpaceChars = sample.replace(/\s+/g, '');
  const nonSpaceLen = Array.from(nonSpaceChars).length;
  const minNonSpace = isCjk ? 95 : 150;
  if (nonSpaceLen < minNonSpace) return false;

  // 1. Reject paragraphs with excessive digits (> 4% of non-space characters or > 4 number groups)
  const digitMatches = sample.match(/\p{N}/gu) || [];
  if (digitMatches.length / nonSpaceLen > 0.04) return false;

  const numberGroups = sample.match(/\p{N}+/gu) || [];
  if (numberGroups.length > 4) return false;

  // 2. Reject phonetic IPA blocks, math symbols, coordinates, or unusual technical characters
  if (/[ˈˌːəɛɪʊɔæɑɒʌɜɝθðʃʒʧʤŋɲʎɾɽβɸɣχʁħʕʔ°±×÷=<>≤≥≈≠∑∏√∞∫§¶†‡•‰′″]/.test(sample)) {
    return false;
  }

  // 3. Ensure text is predominantly letters + combining marks (abugida-safe)
  const allLetters = sample.match(/\p{L}/gu) || [];
  const allLettersAndMarks = sample.match(/[\p{L}\p{M}]/gu) || [];
  const minLetterUnits = isCjk ? 85 : 130;
  if (allLetters.length === 0 || allLettersAndMarks.length < minLetterUnits) return false;
  if (allLettersAndMarks.length / nonSpaceLen < 0.82) return false;

  // 4. Native Script Purity Check:
  // At least 94% of all base letters in the paragraph must belong to the language's native script.
  const expectedRegex = SCRIPT_CHAR_REGEX[langObj.script];
  if (expectedRegex) {
    let nativeScriptCount = 0;
    for (const ch of allLetters) {
      if (expectedRegex.test(ch)) nativeScriptCount++;
    }
    if (nativeScriptCount / allLetters.length < 0.94) return false;
  }

  // 5. Japanese Kana Check:
  // Standard mode requires a natural Kana ratio (>= 15%); Hard Mode Kanji-dense lookup
  // relaxes this floor (>= 2%) to allow authentic encyclopedic Kanji-heavy paragraphs.
  if (langObj.code === 'ja') {
    const kanaMatches = sample.match(/[\p{Script=Hiragana}\p{Script=Katakana}]/gu) || [];
    const minKanaRatio = options.allowLowKana ? 0.02 : 0.15;
    if (kanaMatches.length / allLetters.length < minKanaRatio) return false;
  }

  return true;
}

/**
 * Splits a raw Wikipedia plain-text extract into clean paragraphs that pass all rules.
 */
function extractCleanParagraphs(rawExtract, langObj, options = {}) {
  if (!rawExtract || typeof rawExtract !== 'string') return [];

  const minCharLen = CJK_LANG_CODES.has(langObj.code) ? 110 : 200;
  const lines = rawExtract
    .split(/\r?\n+/)
    .map(line => line.trim())
    .filter(Boolean);

  const valid = [];
  for (const p of lines) {
    if (Array.from(p).length < minCharLen) continue;
    if (/^=+.*=+$/.test(p)) continue;
    if (hasForbiddenBrackets(p)) continue;
    if (/https?:\/\/|www\.|ISBN\s*\d/i.test(p)) continue;
    if (!passesLanguagePurityAndNumberCheck(p, langObj, options)) continue;

    valid.push(p);
  }
  return valid;
}

/**
 * Hard Mode Japanese Helper:
 * Searches for an authentic, unedited Kanji-dense paragraph (>= 50% Han characters)
 * from the Wikipedia article instead of synthesizing artificial noun lists.
 */
function findAuthenticKanjiDenseJapaneseParagraph(rawExtract, langObj) {
  if (!rawExtract || !langObj || langObj.code !== 'ja') return null;

  const candidates = extractCleanParagraphs(rawExtract, langObj, { allowLowKana: true });
  let bestParagraph = null;
  let bestKanjiRatio = 0;

  for (const p of candidates) {
    const allLetters = p.match(/\p{L}/gu) || [];
    if (allLetters.length === 0) continue;
    const kanjiMatches = p.match(/\p{Script=Han}/gu) || [];
    const kanjiRatio = kanjiMatches.length / allLetters.length;
    if (kanjiRatio >= 0.5 && kanjiRatio > bestKanjiRatio) {
      bestKanjiRatio = kanjiRatio;
      bestParagraph = p;
    }
  }

  return bestParagraph;
}

/**
 * Queries a single random Wikipedia article on `{wikiSubdomain}.wikipedia.org`.
 */
async function fetchSingleRandomWikiPage(wikiSubdomain) {
  const endpoint =
    `https://${wikiSubdomain}.wikipedia.org/w/api.php` +
    `?action=query&format=json&origin=*` +
    `&generator=random&grnnamespace=0&grnlimit=1` +
    `&prop=extracts|info&inprop=url&explaintext=1&exsectionformat=plain`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6500);

  try {
    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.query || !data.query.pages) return null;
    const pages = Object.values(data.query.pages);
    return pages.length > 0 ? pages[0] : null;
  } catch (err) {
    clearTimeout(timer);
    return null;
  }
}

/**
 * Returns the candidate pool of languages that haven't been used yet when in 10 Tries Mode
 * (including both already-played rounds and rounds sitting in the prefetch queue).
 */
function getEligibleTargetLanguages() {
  const pool = getActiveLanguagePool();
  if (state.config.mode !== 'ten_tries') {
    return pool;
  }

  const usedCodes = new Set();
  if (Array.isArray(state.history)) {
    state.history.forEach(item => {
      if (item && item.targetLang) usedCodes.add(item.targetLang.code);
    });
  }
  if (state.currentQuestion && state.currentQuestion.targetLang) {
    usedCodes.add(state.currentQuestion.targetLang.code);
  }
  if (Array.isArray(state.prefetchQueue)) {
    state.prefetchQueue.forEach(item => {
      if (item && item.targetLang) usedCodes.add(item.targetLang.code);
    });
  }

  const unvisited = pool.filter(l => !usedCodes.has(l.code));
  return unvisited.length > 0 ? unvisited : pool;
}

/**
 * Removes duplicate target languages from the prefetch queue (e.g., when switching
 * from Endless Mode into 10 Tries Mode) and triggers replenishment if needed.
 */
function deduplicatePrefetchQueue() {
  if (!Array.isArray(state.prefetchQueue) || state.prefetchQueue.length <= 1) {
    updatePrefetchBadgesUI();
    return;
  }

  const seen = new Set();
  if (Array.isArray(state.history)) {
    state.history.forEach(item => {
      if (item && item.targetLang) seen.add(item.targetLang.code);
    });
  }
  if (state.currentQuestion && state.currentQuestion.targetLang) {
    seen.add(state.currentQuestion.targetLang.code);
  }

  const uniqueQueue = [];
  for (const item of state.prefetchQueue) {
    if (!item || !item.targetLang) continue;
    if (!seen.has(item.targetLang.code)) {
      seen.add(item.targetLang.code);
      uniqueQueue.push(item);
    }
  }

  state.prefetchQueue = uniqueQueue;
  updatePrefetchBadgesUI();
  ensurePrefetchQueue();
}

/**
 * Generates a complete valid round from a live Wikipedia article.
 * Pre-computes answer options for all 3 difficulties (`easy`, `medium`, `hard`)
 * so changing difficulty never resets preloaded articles.
 */
async function generateValidArticleRound() {
  const maxAttempts = 12;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const eligiblePool = getEligibleTargetLanguages();
    const targetLang = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];
    const subdomain = targetLang.wikiSubdomain || targetLang.code;
    const batchPromises = Array.from({ length: 4 }, () => fetchSingleRandomWikiPage(subdomain));
    const pages = await Promise.all(batchPromises);

    for (const page of pages) {
      if (!page || !page.extract || !page.title) continue;

      const hardParagraph = targetLang.code === 'ja'
        ? findAuthenticKanjiDenseJapaneseParagraph(page.extract, targetLang)
        : null;

      const cleanParagraphs = extractCleanParagraphs(page.extract, targetLang);
      if (cleanParagraphs.length > 0) {
        const chosenParagraph = cleanParagraphs[Math.floor(Math.random() * Math.min(cleanParagraphs.length, 3))];
        const articleUrl = page.fullurl || `https://${subdomain}.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`;
        const optionsByDifficulty = buildAllDifficultyOptions(targetLang);

        return {
          targetLang,
          articleTitle: page.title,
          articleUrl,
          paragraph: chosenParagraph,
          hardParagraph,
          optionsByDifficulty,
          options: optionsByDifficulty[state.config.difficulty]
        };
      }
    }
  }

  // Fallback articles if offline or rate-limited
  const fallbackSamples = [
    {
      code: 'es',
      title: 'Literatura hispanoamericana',
      url: 'https://es.wikipedia.org/wiki/Literatura_hispanoamericana',
      text: 'La literatura hispanoamericana abarca todas aquellas obras literarias escritas en lengua española por autores nacidos en los diversos países que conforman la región de América Latina desde el periodo colonial hasta la actualidad contemporánea.'
    },
    {
      code: 'de',
      title: 'Philosophie der Neuzeit',
      url: 'https://de.wikipedia.org/wiki/Philosophie_der_Neuzeit',
      text: 'Die Philosophie der Neuzeit bezeichnet eine vielschichtige Epoche des europäischen Denkens, in der wissenschaftliche Methodik, vernunftgeleitete Erkenntnistheorie und politische Selbstbestimmung in den Mittelpunkt rückten.'
    },
    {
      code: 'fr',
      title: 'Architecture gothique',
      url: 'https://fr.wikipedia.org/wiki/Architecture_gothique',
      text: 'L’architecture gothique est un style architectural qui s’est développé en Europe occidentale à partir du milieu du Moyen Âge, caractérisé par l’utilisation de la voûte sur croisée d’ogives et de l’arc-boutant.'
    },
    {
      code: 'pt',
      title: 'Ecossistema marinho',
      url: 'https://pt.wikipedia.org/wiki/Ecossistema_marinho',
      text: 'Os ecossistemas marinhos estão entre os maiores ecossistemas aquáticos do planeta Terra e distinguem-se pela presença de águas com elevada concentração de sais dissolvidos, abrigando enorme biodiversidade costeira e oceânica.'
    },
    {
      code: 'it',
      title: 'Rinascimento italiano',
      url: 'https://it.wikipedia.org/wiki/Rinascimento_italiano',
      text: 'Il Rinascimento italiano rappresentò un periodo di straordinaria fioritura artistica, letteraria, filosofica e scientifica che ebbe origine nella penisola italiana per poi diffondersi gradualmente nel resto del continente europeo.'
    },
    {
      code: 'nl',
      title: 'Waterbeheer in Nederland',
      url: 'https://nl.wikipedia.org/wiki/Waterbeheer_in_Nederland',
      text: 'Het waterbeheer in Nederland vormt al eeuwenlang een essentieel onderdeel van de ruimtelijke ordening en veiligheid, waarbij dijken, duinen, gemalen en waterkeringen het laaggelegen land beschermen tegen overstromingen.'
    },
    {
      code: 'pl',
      title: 'Geografia Europy',
      url: 'https://pl.wikipedia.org/wiki/Geografia_Europy',
      text: 'Geografia Europy obejmuje niezwykle zróżnicowane ukształtowanie powierzchni, od rozległych nizin środkowoeuropejskich oraz wschodnich równin po wysokie łańcuchy górskie na południu i północy kontynentu.'
    },
    {
      code: 'sv',
      title: 'Skandinavisk historia',
      url: 'https://sv.wikipedia.org/wiki/Skandinavisk_historia',
      text: 'Skandinaviens historia präglas av nära kulturella, språkliga och ekonomiska förbindelser mellan de nordiska folken samt en lång tradition av sjöfart, handel och samhällsutveckling kring Östersjön och Nordsjön.'
    },
    {
      code: 'tr',
      title: 'Anadolu uygarlıkları',
      url: 'https://tr.wikipedia.org/wiki/Anadolu_uygarl%C4%B1klar%C4%B1',
      text: 'Anadolu yarımadası, tarih boyunca Asya ile Avrupa kıtaları arasında doğal bir köprü görevi üstlenmiş ve birbirinden farklı pek çok kadim uygarlığın kültürel, ticari ve mimari mirasına ev sahipliği yapmıştır.'
    },
    {
      code: 'id',
      title: 'Kepulauan Nusantara',
      url: 'https://id.wikipedia.org/wiki/Nusantara',
      text: 'Kepulauan Nusantara merupakan wilayah maritim tropis yang terdiri atas ribuan pulau besar maupun kecil yang membentang di sepanjang garis khatulistiwa serta memiliki keanekaragaman hayati dan budaya yang sangat kaya.'
    }
  ];

  const eligibleCodes = new Set(getEligibleTargetLanguages().map(l => l.code));
  const filteredFallbacks = fallbackSamples.filter(f => eligibleCodes.has(f.code));
  const pickList = filteredFallbacks.length > 0 ? filteredFallbacks : fallbackSamples;
  const fb = pickList[Math.floor(Math.random() * pickList.length)];
  const langObj = WIKI_LANGUAGES.find(l => l.code === fb.code) || WIKI_LANGUAGES[0];
  const optionsByDifficulty = buildAllDifficultyOptions(langObj);

  return {
    targetLang: langObj,
    articleTitle: fb.title,
    articleUrl: fb.url,
    paragraph: fb.text,
    hardParagraph: null,
    optionsByDifficulty,
    options: optionsByDifficulty[state.config.difficulty]
  };
}

/**
 * Updates the UI badges showing a status light for preloaded rounds in the background queue.
 */
function updatePrefetchBadgesUI() {
  const dict = t();
  const count = state.prefetchQueue.length;
  const setupDot = document.getElementById('setupPrefetchDot');
  const gameDot = document.getElementById('gamePrefetchDot');
  const setupBadge = document.getElementById('setupPrefetchBadge');
  const gameBadge = document.getElementById('gamePrefetchBadge');
  const setupText = document.getElementById('setupPrefetchText');
  const gameText = document.getElementById('gamePrefetchText');

  if (count > 0) {
    const readyLabel = dict.prefetchReady(count, state.prefetchTargetSize);
    if (setupDot) setupDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]';
    if (gameDot) gameDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]';
    if (setupBadge) setupBadge.title = readyLabel;
    if (gameBadge) gameBadge.title = readyLabel;
    if (setupText) setupText.textContent = readyLabel;
    if (gameText) gameText.textContent = readyLabel;
  } else {
    if (setupDot) setupDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse';
    if (gameDot) gameDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse';
    if (setupBadge) setupBadge.title = dict.prefetchWarming;
    if (gameBadge) gameBadge.title = dict.prefetchWarming;
    if (setupText) setupText.textContent = dict.prefetchWarming;
    if (gameText) gameText.textContent = dict.prefetchWarming;
  }
}

/**
 * Continuously replenishes the background prefetch queue up to `prefetchTargetSize`.
 */
async function ensurePrefetchQueue() {
  updatePrefetchBadgesUI();
  if (state.prefetchInFlight) return;
  state.prefetchInFlight = true;
  const startEpoch = state.prefetchEpoch;

  try {
    while (state.prefetchQueue.length < state.prefetchTargetSize && startEpoch === state.prefetchEpoch) {
      const item = await generateValidArticleRound();
      if (startEpoch !== state.prefetchEpoch) break;
      if (item) {
        if (state.config.mode === 'ten_tries') {
          const exists = state.prefetchQueue.some(q => q && q.targetLang && q.targetLang.code === item.targetLang.code);
          if (exists && getEligibleTargetLanguages().length > 1) {
            continue;
          }
        }
        state.prefetchQueue.push(item);
        updatePrefetchBadgesUI();
      }
    }
  } finally {
    state.prefetchInFlight = false;
    updatePrefetchBadgesUI();
  }
}
