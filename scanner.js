/**
 * ============================================================================
 * STRICT BRACKET-FREE WIKIPEDIA SCANNER & BACKGROUND PREFETCHER
 * ============================================================================
 * Handles fetching random Wikipedia articles, verifying character/number purity,
 * building 100% Kanji passages in Hard Mode for Japanese, and maintaining the
 * background prefetch queue.
 */

function isNaturalLanguageParagraph(paragraph, langObj, allowPureKanji = false) {
  // Inspect the visible portion (up to 600 chars) so what the player sees is guaranteed clean
  const sample = paragraph.slice(0, 600);
  const nonSpaceChars = sample.replace(/\s+/g, '');
  if (nonSpaceChars.length < 150) return false;

  // 1. Reject paragraphs with too many numbers (> 4% digits or > 4 number groups)
  const digitMatches = sample.match(/\p{N}/gu) || [];
  if (digitMatches.length / nonSpaceChars.length > 0.04) return false;
  const numberClusters = sample.match(/\p{N}+/gu) || [];
  if (numberClusters.length > 4) return false;

  // 2. Reject paragraphs containing math/code/phonetic/table symbols not used in normal prose
  if (/[=+<>|\\/^*_~@#$%&§°±×÷≈≠≤≥∞∑∏√∫\u0250-\u02AF\u1D00-\u1DBF]/.test(sample)) return false;

  // 3. Enforce native script & character purity for the selected language
  const letters = sample.match(/\p{L}/gu) || [];
  const marks = sample.match(/\p{M}/gu) || [];
  if (letters.length === 0) return false;

  // At least 82% of non-whitespace characters must be actual letters/diacritics
  if ((letters.length + marks.length) / nonSpaceChars.length < 0.82) return false;

  const expectedScriptRegex = SCRIPT_CHAR_REGEX[langObj?.script] || /\p{Script=Latin}/u;
  let nativeLetterCount = 0;
  for (const ch of letters) {
    if (expectedScriptRegex.test(ch)) nativeLetterCount++;
  }

  // At least 94% of all letters must belong to the language's native script
  if (nativeLetterCount / letters.length < 0.94) return false;

  // Special check for Japanese:
  // Standard paragraphs require Hiragana or Katakana (>=15%).
  // When allowPureKanji is true (for the Hard Mode variant), 100% Kanji is allowed.
  if (langObj?.code === 'ja' && !allowPureKanji) {
    const kanaMatches = sample.match(/[\p{Script=Hiragana}\p{Script=Katakana}]/gu) || [];
    if (kanaMatches.length / letters.length < 0.15) return false;
  }

  return true;
}

/**
 * Extracts a 100% Kanji passage from a Japanese article extract for Hard Mode.
 */
function buildKanjiOnlyParagraph(extractText) {
  if (!extractText || typeof extractText !== 'string') return null;
  const cleanLines = extractText
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length >= 60 && !/[()\[\]{}（）【】「」『』]/.test(p));

  const kanjiStream = cleanLines
    .join('。')
    .replace(/[^\p{Script=Han}、。]/gu, '')
    .replace(/[、。]{2,}/g, '、')
    .replace(/^[、。]+|[、。]+$/g, '');

  if (kanjiStream.length >= 200) {
    return kanjiStream + '。';
  }
  return null;
}

/**
 * Scans an article extract paragraph-by-paragraph for a valid, bracket-free snippet.
 */
function findStrictCleanParagraph(extractText, langObj) {
  if (!extractText || typeof extractText !== 'string') return null;

  const paragraphs = extractText
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length >= 200);

  for (const p of paragraphs) {
    // Method 2: Strictly reject any paragraph containing (), {}, or [] (including full-width brackets)
    if (/[()\[\]{}（）【】「」『』]/.test(p)) continue;
    // Reject list/heading lines or stub markers
    if (/^(==|\*|\d+\.|•)/.test(p)) continue;
    // Reject paragraphs with excessive numbers or characters foreign to the selected language
    if (!isNaturalLanguageParagraph(p, langObj, false)) continue;
    return p;
  }
  return null;
}

/**
 * Queries a single random Wikipedia page for the given language object.
 * Pre-generates answer options for all 3 difficulties so switching difficulty never resets the queue.
 */
async function fetchSingleRandomWikiCandidate(langObj) {
  const endpoint = `https://${langObj.code}.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&grnlimit=1&prop=extracts|info&inprop=url&explaintext=1&exsectionformat=plain&format=json&origin=*`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5500);
  try {
    const res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    for (const pageId of Object.keys(pages)) {
      const page = pages[pageId];
      const cleanPara = findStrictCleanParagraph(page?.extract, langObj);
      if (cleanPara) {
        let hardParagraph = null;
        if (langObj.code === 'ja' && Math.random() < 0.4) {
          const pureKanji = buildKanjiOnlyParagraph(page?.extract);
          if (pureKanji && isNaturalLanguageParagraph(pureKanji, langObj, true)) {
            hardParagraph = pureKanji;
          }
        }
        return {
          targetLang: langObj,
          paragraph: cleanPara,
          hardParagraph,
          optionsByDifficulty: buildAllDifficultyOptions(langObj),
          articleTitle: page.title || 'Wikipedia',
          articleUrl: page.fullurl || `https://${langObj.code}.wikipedia.org/wiki/${encodeURIComponent(page.title || '')}`
        };
      }
    }
  } catch (e) {
    clearTimeout(timer);
  }
  return null;
}

/**
 * Returns the candidate target languages excluding already-queued languages
 * and (in 10 Tries mode) any language already played in the current session.
 */
function getEligibleTargetLanguages() {
  const pool = getActiveLanguagePool();
  const excludedCodes = new Set();

  // Never duplicate a language currently sitting in the prefetch buffer
  state.prefetchQueue.forEach(item => {
    if (item?.targetLang?.code) excludedCodes.add(item.targetLang.code);
  });

  // In 10 Tries mode, never repeat a language already played or currently active on screen
  if (state.config.mode === 'ten_tries') {
    state.history.forEach(h => {
      if (h?.targetLang?.code) excludedCodes.add(h.targetLang.code);
    });
    if ((state.status === 'playing' || state.status === 'revealed') && state.currentQuestion?.targetLang?.code) {
      excludedCodes.add(state.currentQuestion.targetLang.code);
    }
  }

  const eligible = pool.filter(l => !excludedCodes.has(l.code));
  return eligible.length > 0 ? eligible : pool;
}

/**
 * Generates a complete valid article round by firing concurrent requests against the eligible pool.
 */
async function generateValidArticleRound() {
  for (let attempt = 0; attempt < 8; attempt++) {
    const eligiblePool = getEligibleTargetLanguages();
    const targetLang = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];
    const results = await Promise.all([
      fetchSingleRandomWikiCandidate(targetLang),
      fetchSingleRandomWikiCandidate(targetLang),
      fetchSingleRandomWikiCandidate(targetLang)
    ]);
    const validHit = results.find(Boolean);
    if (validHit) {
      return validHit;
    }
  }

  // Fallback across 4 random eligible languages concurrently
  const fallbackLangs = shuffleArray(getEligibleTargetLanguages()).slice(0, 4);
  const fallbackHits = await Promise.all(fallbackLangs.map(l => fetchSingleRandomWikiCandidate(l)));
  const hit = fallbackHits.find(Boolean);
  if (hit) return hit;

  // Guaranteed safe fallback paragraph (>=200 chars, zero brackets)
  const eligiblePool = getEligibleTargetLanguages();
  const safeLang = eligiblePool[0] || WIKI_LANGUAGES[0];
  return {
    targetLang: safeLang,
    paragraph: 'Wikipedia is a free content online encyclopedia written and maintained by a community of volunteers through open collaboration and a wiki software system. It is the largest and most read reference work in history.',
    hardParagraph: null,
    optionsByDifficulty: buildAllDifficultyOptions(safeLang),
    articleTitle: 'Wikipedia',
    articleUrl: `https://${safeLang.code}.wikipedia.org`
  };
}

/**
 * Updates the UI badges showing how many rounds are preloaded in the background queue.
 */
function updatePrefetchBadgesUI() {
  const dict = t();
  const count = state.prefetchQueue.length;
  const setupDot = document.getElementById('setupPrefetchDot');
  const setupText = document.getElementById('setupPrefetchText');
  const gameText = document.getElementById('gamePrefetchText');

  if (count > 0) {
    setupDot.className = 'w-2 h-2 rounded-full bg-emerald-400';
    setupText.textContent = dict.prefetchReady(count, state.prefetchTargetSize);
    if (gameText) gameText.textContent = dict.prefetchReady(count, state.prefetchTargetSize);
  } else {
    setupDot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse';
    setupText.textContent = dict.prefetchWarming;
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
        state.prefetchQueue.push(item);
        updatePrefetchBadgesUI();
      }
    }
  } finally {
    state.prefetchInFlight = false;
    updatePrefetchBadgesUI();
  }
}
