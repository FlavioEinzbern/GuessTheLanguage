/**
 * ============================================================================
 * GAME STATE, DISTRACTOR LOGIC & UI CONTROLLER
 * ============================================================================
 */

const state = {
  status: 'setup', // 'setup' | 'playing' | 'revealed' | 'gameover'
  config: {
    uiLang: detectBrowserLanguage(),
    mode: 'ten_tries',       // 'ten_tries' | 'endless_3' | 'endless_1'
    pool: 'stable',          // 'stable' | 'experimental' | 'custom'
    difficulty: 'easy',      // 'easy' | 'medium' | 'hard'
    customCategories: new Set(['european', 'asian']),
    alwaysShowNative: false
  },
  round: 1,
  maxRounds: 10,
  score: 0,
  streak: 0,
  bestStreak: 0,
  lives: 3,
  currentQuestion: null,
  selectedCode: null,
  history: [],
  prefetchQueue: [],
  prefetchTargetSize: 3,
  prefetchInFlight: false,
  prefetchEpoch: 0
};

function t() {
  return I18N[state.config.uiLang] || I18N.en;
}

function getLocalizedLanguageName(langObj) {
  const ui = state.config.uiLang;
  if (ui === 'en') return langObj.name;
  if (MANUAL_LANG_NAMES[ui] && MANUAL_LANG_NAMES[ui][langObj.code]) {
    return MANUAL_LANG_NAMES[ui][langObj.code];
  }
  try {
    const dn = new Intl.DisplayNames([ui], { type: 'language' });
    const translated = dn.of(langObj.code);
    if (translated && translated.toLowerCase() !== langObj.code.toLowerCase()) {
      return translated.charAt(0).toUpperCase() + translated.slice(1);
    }
  } catch (e) {}
  return langObj.name;
}

/**
 * Returns the filtered array of Wikipedia languages based on the active pool setting.
 */
function getActiveLanguagePool() {
  if (state.config.pool === 'stable') {
    return WIKI_LANGUAGES.filter(l => l.pool === 'stable');
  }
  if (state.config.pool === 'experimental') {
    return WIKI_LANGUAGES;
  }
  const customFiltered = WIKI_LANGUAGES.filter(l =>
    l.cats.some(c => state.config.customCategories.has(c))
  );
  return customFiltered.length >= 4 ? customFiltered : WIKI_LANGUAGES.filter(l => l.pool === 'stable');
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Checks whether two scripts are identical or belong to the same visually similar macro-script group.
 */
function areScriptsVisuallySimilar(scriptA, scriptB) {
  if (scriptA === scriptB) return true;
  if (typeof HARD_MACRO_SCRIPT_GROUPS !== 'undefined') {
    return HARD_MACRO_SCRIPT_GROUPS.some(group => group.includes(scriptA) && group.includes(scriptB));
  }
  return false;
}

/**
 * Builds the 4 language answer options according to Easy, Medium, or Hard distractor rules.
 */
function buildFourOptions(targetLang, difficultyOverride) {
  const difficulty = difficultyOverride || state.config.difficulty;
  const pool = getActiveLanguagePool();
  const others = pool.filter(l => l.code !== targetLang.code);
  const allOthers = WIKI_LANGUAGES.filter(l => l.code !== targetLang.code);
  let distractors = [];

  if (difficulty === 'easy') {
    distractors = shuffleArray(others).slice(0, 3);
  } else if (difficulty === 'medium') {
    // Medium Mode:
    // Avoid more than 2 extremely similar languages with the same/visually similar writing system
    // or the same language family across the 4 options.
    const matchingClusters = MEDIUM_COUSIN_CLUSTERS.filter(cl => cl.includes(targetLang.code));
    const cousinCodes = new Set();
    matchingClusters.forEach(cl => cl.forEach(c => { if (c !== targetLang.code) cousinCodes.add(c); }));

    let clusterCandidates = others.filter(l => cousinCodes.has(l.code));
    if (clusterCandidates.length < 3) {
      clusterCandidates = allOthers.filter(l => cousinCodes.has(l.code));
    }

    const canAddMediumCandidate = (cand) => {
      if (distractors.some(d => d.code === cand.code)) return false;
      const currentOptions = [targetLang, ...distractors];
      const similarScriptCount = currentOptions.filter(o => areScriptsVisuallySimilar(o.script, cand.script)).length;
      const sameFamilyCount = currentOptions.filter(o => o.family === cand.family).length;
      // Never allow more than 2 options with the same/visually similar script or same family
      return similarScriptCount < 2 && sameFamilyCount < 2;
    };

    const diffScriptCousins = shuffleArray(
      clusterCandidates.filter(l => !areScriptsVisuallySimilar(l.script, targetLang.script))
    );
    const sameScriptCousins = shuffleArray(
      clusterCandidates.filter(l => areScriptsVisuallySimilar(l.script, targetLang.script))
    );

    // 1. Add at most 1 same/similar-script cousin so the target script has at most 2 options total
    for (const cand of sameScriptCousins) {
      if (canAddMediumCandidate(cand)) {
        distractors.push(cand);
        break;
      }
    }

    // 2. Fill remaining slots with cross-script cousins that respect the max-2 rule
    for (const cand of diffScriptCousins) {
      if (distractors.length >= 3) break;
      if (canAddMediumCandidate(cand)) {
        distractors.push(cand);
      }
    }

    // 3. Fallback to active pool / full pool while still enforcing max-2 script & family diversity
    const diversePoolFallback = [
      ...shuffleArray(others.filter(l => !areScriptsVisuallySimilar(l.script, targetLang.script))),
      ...shuffleArray(allOthers.filter(l => !areScriptsVisuallySimilar(l.script, targetLang.script))),
      ...shuffleArray(others.filter(l => l.family !== targetLang.family))
    ];
    for (const cand of diversePoolFallback) {
      if (distractors.length >= 3) break;
      if (canAddMediumCandidate(cand)) {
        distractors.push(cand);
      }
    }

    // 4. If pool is single-script (e.g. Latin-only custom category), still cap same-family at max 2
    for (const cand of shuffleArray(others)) {
      if (distractors.length >= 3) break;
      if (!distractors.some(d => d.code === cand.code)) {
        const sameFamilyCount = [targetLang, ...distractors].filter(o => o.family === cand.family).length;
        if (sameFamilyCount < 2) distractors.push(cand);
      }
    }
  } else {
    // Hard Mode:
    // 1. Exact same script + same language family (preferring active pool first, then full database)
    const poolSameScriptFamily = shuffleArray(others.filter(l => l.script === targetLang.script && l.family === targetLang.family));
    const allSameScriptFamily = shuffleArray(allOthers.filter(l => l.script === targetLang.script && l.family === targetLang.family));

    // 2. Exact same script + different family (preferring active pool first, then full database)
    const poolSameScriptOnly = shuffleArray(others.filter(l => l.script === targetLang.script && l.family !== targetLang.family));
    const allSameScriptOnly = shuffleArray(allOthers.filter(l => l.script === targetLang.script && l.family !== targetLang.family));

    // 3. Visually similar Macro-Script fallback (when exact script has < 3 matches)
    const matchingMacroGroups = (typeof HARD_MACRO_SCRIPT_GROUPS !== 'undefined' ? HARD_MACRO_SCRIPT_GROUPS : [])
      .filter(group => group.includes(targetLang.script));
    const macroScripts = new Set();
    matchingMacroGroups.forEach(group => group.forEach(s => {
      if (s !== targetLang.script) macroScripts.add(s);
    }));

    const poolMacroMatches = shuffleArray(others.filter(l => macroScripts.has(l.script)));
    const allMacroMatches = shuffleArray(allOthers.filter(l => macroScripts.has(l.script)));

    // 4. Same language family across scripts before final random fallback
    const sameFamilyFallback = shuffleArray(others.filter(l => l.family === targetLang.family));

    const prioritizedHardCandidates = [
      ...poolSameScriptFamily,
      ...allSameScriptFamily,
      ...poolSameScriptOnly,
      ...allSameScriptOnly,
      ...poolMacroMatches,
      ...allMacroMatches,
      ...sameFamilyFallback
    ];

    for (const cand of prioritizedHardCandidates) {
      if (distractors.length >= 3) break;
      if (!distractors.some(d => d.code === cand.code)) {
        distractors.push(cand);
      }
    }
  }

  for (const fallback of shuffleArray(others)) {
    if (distractors.length >= 3) break;
    if (!distractors.some(d => d.code === fallback.code)) distractors.push(fallback);
  }

  return shuffleArray([targetLang, ...distractors.slice(0, 3)]);
}

/**
 * Pre-generates answer option sets for all 3 difficulties (Easy, Medium, Hard)
 * so switching difficulty on the setup screen never invalidates preloaded articles.
 */
function buildAllDifficultyOptions(targetLang) {
  return {
    easy: buildFourOptions(targetLang, 'easy'),
    medium: buildFourOptions(targetLang, 'medium'),
    hard: buildFourOptions(targetLang, 'hard')
  };
}

function showScreen(screenName) {
  document.getElementById('setupScreen').classList.toggle('hidden', screenName !== 'setup');
  document.getElementById('gameScreen').classList.toggle('hidden', screenName !== 'game');
  document.getElementById('summaryScreen').classList.toggle('hidden', screenName !== 'summary');
}

function isEndlessMode() {
  return state.config.mode === 'endless_3' || state.config.mode === 'endless_1';
}

function updateCategoryCountsAndBadges() {
  const dict = t();
  const counts = {
    european: WIKI_LANGUAGES.filter(l => l.cats.includes('european')).length,
    asian: WIKI_LANGUAGES.filter(l => l.cats.includes('asian')).length,
    african: WIKI_LANGUAGES.filter(l => l.cats.includes('african')).length,
    austronesian: WIKI_LANGUAGES.filter(l => l.cats.includes('austronesian')).length,
    indigenous: WIKI_LANGUAGES.filter(l => l.cats.includes('indigenous')).length
  };
  document.getElementById('catCountEuro').textContent = counts.european;
  document.getElementById('catCountAsian').textContent = counts.asian;
  document.getElementById('catCountAfrican').textContent = counts.african;
  document.getElementById('catCountAustro').textContent = counts.austronesian;
  document.getElementById('catCountIndig').textContent = counts.indigenous;

  const customTotal = WIKI_LANGUAGES.filter(l => l.cats.some(c => state.config.customCategories.has(c))).length;
  document.getElementById('customPoolBadge').textContent = dict.customBadgeText(state.config.customCategories.size, customTotal);

  document.querySelectorAll('.category-checkbox').forEach(cb => {
    cb.checked = state.config.customCategories.has(cb.value);
  });
}

function updateConfigCardsUI() {
  document.querySelectorAll('.config-card').forEach(card => {
    const group = card.getAttribute('data-config-group');
    const val = card.getAttribute('data-config-value');
    const isActive = state.config[group] === val;
    card.classList.toggle('active', isActive);
  });
  updateCategoryCountsAndBadges();
}

function updateHudUI() {
  const dict = t();
  document.getElementById('hudRoundLabel').textContent = dict.hudRoundLabel;
  document.getElementById('hudScoreLabel').textContent = dict.hudScoreLabel;
  document.getElementById('hudStreakLabel').textContent = dict.hudStreakLabel;
  document.getElementById('hudLivesLabel').textContent = dict.hudLivesLabel;
  document.getElementById('hudSettingsBtnText').textContent = dict.hudSettingsBtnText;

  document.getElementById('hudRoundValue').textContent = state.config.mode === 'ten_tries'
    ? `${state.round} / ${state.maxRounds}`
    : `${state.round}`;
  document.getElementById('hudScoreValue').textContent = `${state.score}`;
  document.getElementById('hudStreakValue').textContent = `${state.streak} 🔥`;

  const livesBadge = document.getElementById('hudLivesBadge');
  if (isEndlessMode()) {
    livesBadge.classList.remove('hidden');
    const maxHearts = state.config.mode === 'endless_1' ? 1 : 3;
    let heartsHtml = '';
    for (let i = 0; i < maxHearts; i++) {
      heartsHtml += i < state.lives ? '❤️' : '🖤';
    }
    document.getElementById('hudLivesValue').textContent = heartsHtml;
  } else {
    livesBadge.classList.add('hidden');
  }
}

function renderOptionButtons() {
  if (!state.currentQuestion) return;
  const grid = document.getElementById('optionsGrid');
  const isRevealed = state.status === 'revealed';
  const showNativeNow = state.config.alwaysShowNative || isRevealed;
  const targetCode = state.currentQuestion.targetLang.code;

  grid.innerHTML = state.currentQuestion.options.map((lang, idx) => {
    const translatedName = getLocalizedLanguageName(lang);
    let btnClasses = 'option-btn w-full px-2.5 sm:px-4 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between gap-2 overflow-hidden ';
    let badgeClasses = 'w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[11px] sm:text-xs font-extrabold shrink-0 ';
    let statusIcon = '';

    if (!isRevealed) {
      btnClasses += 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/60 text-white';
      badgeClasses += 'bg-slate-800 text-slate-300 border border-slate-700';
    } else {
      const isSelected = state.selectedCode === lang.code;
      const isCorrect = lang.code === targetCode;

      if (isSelected && isCorrect) {
        // Selected & Right -> GREEN
        btnClasses += 'bg-emerald-600/25 border-emerald-500 text-white shadow-lg shadow-emerald-600/20';
        badgeClasses += 'bg-emerald-500 text-slate-950';
        statusIcon = '<i class="fa-solid fa-circle-check text-emerald-400 text-sm sm:text-base"></i>';
      } else if (isSelected && !isCorrect) {
        // Selected & Wrong -> RED
        btnClasses += 'bg-rose-600/25 border-rose-500 text-white shadow-lg shadow-rose-600/20';
        badgeClasses += 'bg-rose-500 text-white';
        statusIcon = '<i class="fa-solid fa-circle-xmark text-rose-400 text-sm sm:text-base"></i>';
      } else if (!isSelected && isCorrect) {
        // Not selected, but is the Correct Answer -> BLUE
        btnClasses += 'bg-sky-600/25 border-sky-400 text-white shadow-lg shadow-sky-600/20';
        badgeClasses += 'bg-sky-400 text-slate-950';
        statusIcon = '<i class="fa-solid fa-circle-check text-sky-300 text-sm sm:text-base"></i>';
      } else {
        btnClasses += 'bg-slate-950/50 border-slate-800/60 text-slate-500 opacity-65';
        badgeClasses += 'bg-slate-900 text-slate-500 border border-slate-800';
      }
    }

    return `
      <button
        type="button"
        data-lang-code="${lang.code}"
        ${isRevealed ? 'disabled' : ''}
        class="${btnClasses}"
      >
        <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <span class="${badgeClasses}">${idx + 1}</span>
          <div class="min-w-0 flex-1 leading-tight">
            <div class="font-bold text-xs sm:text-base truncate">${escapeHtml(translatedName)}</div>
            <div class="${showNativeNow ? 'visible opacity-100' : 'invisible opacity-0'} text-[10px] sm:text-xs text-slate-300/90 font-medium truncate h-3.5 sm:h-4 leading-tight transition-opacity">
              ${escapeHtml(lang.native)}
            </div>
          </div>
        </div>
        <div class="shrink-0 w-4 flex items-center justify-center">${statusIcon}</div>
      </button>
    `;
  }).join('');

  if (!isRevealed) {
    grid.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-lang-code');
        if (code) handleOptionSelect(code);
      });
    });
  }
}

function formatDisplayParagraph(text) {
  if (!text) return '';
  if (text.length <= 600) return text;
  return text.slice(0, 600).trimEnd() + '...';
}

function displayQuestionOnScreen(questionData) {
  const dict = t();
  const activeDiff = state.config.difficulty;

  // Use the Hard Mode 100% Kanji variant for Japanese if hard difficulty is active and available
  const rawParagraph = (activeDiff === 'hard' && questionData.hardParagraph)
    ? questionData.hardParagraph
    : questionData.paragraph;
  const formattedParagraph = formatDisplayParagraph(rawParagraph);

  const optionsByDifficulty = questionData.optionsByDifficulty || buildAllDifficultyOptions(questionData.targetLang);
  const activeOptions = optionsByDifficulty[activeDiff] || buildFourOptions(questionData.targetLang, activeDiff);

  state.currentQuestion = {
    ...questionData,
    optionsByDifficulty,
    paragraph: formattedParagraph,
    options: activeOptions
  };
  state.selectedCode = null;
  state.status = 'playing';

  document.getElementById('scannerLoadingState').classList.add('hidden');
  document.getElementById('snippetContentArea').classList.remove('hidden');
  document.getElementById('revealCardContainer').classList.add('hidden');

  const paragraphEl = document.getElementById('wikiParagraphText');
  paragraphEl.textContent = state.currentQuestion.paragraph;
  document.getElementById('charCountBadge').textContent = dict.charsUnit(state.currentQuestion.paragraph.length);

  updateHudUI();
  renderOptionButtons();
}

async function loadNextRound() {
  state.status = 'loading';
  document.getElementById('revealCardContainer').classList.add('hidden');
  document.getElementById('optionsGrid').innerHTML = '';
  updateHudUI();

  const usedInTenTries = state.config.mode === 'ten_tries'
    ? new Set(state.history.map(h => h.targetLang.code))
    : null;

  while (state.prefetchQueue.length > 0) {
    const nextPreloaded = state.prefetchQueue.shift();
    // In 10 Tries mode, skip any preloaded article whose language was already played in this run
    if (usedInTenTries && usedInTenTries.has(nextPreloaded.targetLang.code)) {
      continue;
    }
    updatePrefetchBadgesUI();
    displayQuestionOnScreen(nextPreloaded);
    ensurePrefetchQueue();
    return;
  }

  document.getElementById('snippetContentArea').classList.add('hidden');
  document.getElementById('scannerLoadingState').classList.remove('hidden');

  const liveRound = await generateValidArticleRound();
  displayQuestionOnScreen(liveRound);
  ensurePrefetchQueue();
}

function startNewGame() {
  state.round = 1;
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.lives = state.config.mode === 'endless_1' ? 1 : 3;
  state.history = [];
  showScreen('game');
  loadNextRound();
}

function updateRevealCardUI() {
  if (!state.currentQuestion || state.status !== 'revealed') return;
  const dict = t();
  const target = state.currentQuestion.targetLang;
  const isCorrect = state.selectedCode === target.code;

  const banner = document.getElementById('revealStatusBanner');
  if (isCorrect) {
    banner.className = 'inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    banner.innerHTML = `<i class="fa-solid fa-check"></i> <span>${escapeHtml(dict.revealCorrect)}</span>`;
  } else {
    banner.className = 'inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30';
    banner.innerHTML = `<i class="fa-solid fa-xmark"></i> <span>${escapeHtml(dict.revealWrong)}</span>`;
  }

  document.getElementById('revealArticleTitle').textContent = state.currentQuestion.articleTitle;
  document.getElementById('revealLangDetails').textContent = dict.revealLangMeta(
    getLocalizedLanguageName(target),
    target.native,
    target.script,
    target.family
  );

  const wikiLink = document.getElementById('revealWikiLink');
  wikiLink.href = state.currentQuestion.articleUrl;
  document.getElementById('revealReadArticleText').textContent = dict.revealReadArticleText;

  const isTenFinished = state.config.mode === 'ten_tries' && state.round >= state.maxRounds;
  const isEndlessOver = isEndlessMode() && state.lives <= 0;

  const nextText = document.getElementById('nextRoundBtnText');
  if (isTenFinished) {
    nextText.textContent = dict.nextBtnFinalScore;
  } else if (isEndlessOver) {
    nextText.textContent = dict.nextBtnGameOver;
  } else {
    nextText.textContent = dict.nextBtnTryAgain;
  }

  document.getElementById('revealCardContainer').classList.remove('hidden');
}

function handleOptionSelect(chosenCode) {
  if (state.status !== 'playing' || !state.currentQuestion) return;
  state.status = 'revealed';
  state.selectedCode = chosenCode;

  const target = state.currentQuestion.targetLang;
  const chosenLang = state.currentQuestion.options.find(o => o.code === chosenCode) || target;
  const isCorrect = chosenCode === target.code;

  if (isCorrect) {
    state.score++;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
  } else {
    state.streak = 0;
    if (isEndlessMode()) {
      state.lives = Math.max(0, state.lives - 1);
    }
  }

  state.history.push({
    round: state.round,
    targetLang: target,
    chosenLang,
    isCorrect,
    articleTitle: state.currentQuestion.articleTitle,
    articleUrl: state.currentQuestion.articleUrl
  });

  updateHudUI();
  renderOptionButtons();
  updateRevealCardUI();
  ensurePrefetchQueue();
}

function handleNextAction() {
  if (state.status !== 'revealed') return;
  const isTenFinished = state.config.mode === 'ten_tries' && state.round >= state.maxRounds;
  const isEndlessOver = isEndlessMode() && state.lives <= 0;

  if (isTenFinished || isEndlessOver) {
    renderSummaryScreen();
  } else {
    state.round++;
    loadNextRound();
  }
}

function renderSummaryScreen() {
  state.status = 'gameover';
  showScreen('summary');

  const dict = t();
  const totalRounds = state.history.length;
  const accuracy = totalRounds > 0 ? Math.round((state.score / totalRounds) * 100) : 0;
  const iconBox = document.getElementById('summaryIconBox');

  if (state.config.mode === 'ten_tries') {
    iconBox.className = 'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
    iconBox.innerHTML = '<i class="fa-solid fa-trophy"></i>';
    document.getElementById('summaryModeBadge').textContent = dict.sumTenTriesBadge;
    document.getElementById('summaryTitle').textContent = dict.sumTenTriesTitle(state.score, state.maxRounds);
  } else if (state.config.mode === 'endless_1') {
    iconBox.className = 'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg bg-amber-500/20 text-amber-300 border border-amber-500/30';
    iconBox.innerHTML = '<i class="fa-solid fa-skull-crossbones"></i>';
    document.getElementById('summaryModeBadge').textContent = dict.sumEndless1Badge;
    document.getElementById('summaryTitle').textContent = dict.sumEndless1Title(state.score);
  } else {
    iconBox.className = 'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg bg-rose-500/20 text-rose-300 border border-rose-500/30';
    iconBox.innerHTML = '<i class="fa-solid fa-heart-crack"></i>';
    document.getElementById('summaryModeBadge').textContent = dict.sumEndless3Badge;
    document.getElementById('summaryTitle').textContent = dict.sumEndless3Title(state.score);
  }

  document.getElementById('sumFinalScore').textContent = state.config.mode === 'ten_tries'
    ? `${state.score}/${state.maxRounds}`
    : `${state.score}`;
  document.getElementById('sumAccuracy').textContent = `${accuracy}%`;
  document.getElementById('sumRounds').textContent = `${totalRounds}`;
  document.getElementById('sumBestStreak').textContent = `${state.bestStreak}`;

  document.getElementById('summaryHistoryList').innerHTML = state.history.map(item => {
    const badgeCls = item.isCorrect
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      : 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    const icon = item.isCorrect ? 'fa-check' : 'fa-xmark';
    const targetName = getLocalizedLanguageName(item.targetLang);
    const chosenName = getLocalizedLanguageName(item.chosenLang);

    return `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm">
        <div class="flex items-center gap-3">
          <span class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold shrink-0 ${badgeCls}">
            <i class="fa-solid ${icon}"></i>
          </span>
          <div>
            <div class="font-bold text-white">
              ${escapeHtml(dict.historyRound(item.round))}: ${escapeHtml(targetName)}
              <span class="text-slate-400 font-normal">(${escapeHtml(item.targetLang.native)} • ${escapeHtml(item.targetLang.script)})</span>
            </div>
            <div class="text-xs text-slate-400">
              ${item.isCorrect
                ? escapeHtml(dict.historyGuessedCorrectly)
                : `${escapeHtml(dict.historyYourGuess)} <span class="text-rose-300 font-medium">${escapeHtml(chosenName)}</span>`
              }
            </div>
          </div>
        </div>
        <a href="${item.articleUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 shrink-0">
          <i class="fa-brands fa-wikipedia-w"></i>
          <span class="truncate max-w-[180px]">${escapeHtml(item.articleTitle)}</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </div>
    `;
  }).join('');
}

function setUiLanguage(langCode) {
  if (!I18N[langCode]) langCode = 'en';
  state.config.uiLang = langCode;
  document.documentElement.lang = langCode;

  document.querySelectorAll('.ui-lang-btn').forEach(btn => {
    const active = btn.getAttribute('data-ui-lang') === langCode;
    btn.className = active
      ? 'ui-lang-btn px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-bold bg-indigo-600 text-white shadow'
      : 'ui-lang-btn px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-white transition';
  });

  const dict = t();
  const mapIds = [
    'headerTitle', 'headerSubtitle', 'setupHeading', 'setupSubheading',
    'labelGameMode', 'modeTenTitle', 'modeTenDesc', 'modeEndless3Title', 'modeEndless3Desc',
    'modeEndless1Title', 'modeEndless1Desc', 'labelLangPool', 'poolStableTitle', 'poolStableDesc',
    'poolExpTitle', 'poolExpDesc', 'poolCustomTitle', 'poolCustomDesc',
    'labelDifficulty', 'diffEasyTitle', 'diffEasyDesc', 'diffMedTitle', 'diffMedDesc',
    'diffHardTitle', 'diffHardDesc', 'startGameBtnText', 'snippetHeaderBadge',
    'scannerStatusTitle', 'scannerStatusSub', 'choosePromptText', 'keyboardHintText',
    'sumScoreLabel', 'sumAccLabel', 'sumRoundsLabel', 'sumStreakLabel', 'sumHistoryHeading',
    'sumChangeSettingsText', 'sumPlayAgainText', 'nativeToggleTitle', 'nativeToggleSub',
    'modalTitle', 'modalSubtitle', 'catEuroTitle', 'catEuroDesc', 'catAsianTitle', 'catAsianDesc',
    'catAfricanTitle', 'catAfricanDesc', 'catAustroTitle', 'catAustroDesc', 'catIndigTitle', 'catIndigDesc',
    'categoryWarningText'
  ];
  mapIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && typeof dict[id] === 'string') el.textContent = dict[id];
  });

  document.getElementById('selectAllCategoriesBtn').textContent = dict.selectAllText;
  document.getElementById('resetCategoriesBtn').textContent = dict.resetText;
  document.getElementById('applyCustomModalBtn').textContent = dict.doneText;

  updateNativeToggleUI();
  updateConfigCardsUI();
  updatePrefetchBadgesUI();
  updateHudUI();

  if (state.currentQuestion) {
    document.getElementById('charCountBadge').textContent = dict.charsUnit(state.currentQuestion.paragraph.length);
    renderOptionButtons();
    if (state.status === 'revealed') updateRevealCardUI();
  }
  if (state.status === 'gameover') {
    renderSummaryScreen();
  }
}

function updateNativeToggleUI() {
  const dict = t();
  const labelEl = document.getElementById('nativeToggleStateText');
  labelEl.textContent = state.config.alwaysShowNative ? dict.nativeStateOn : dict.nativeStateOff;
  labelEl.className = state.config.alwaysShowNative
    ? 'text-xs font-bold text-indigo-400'
    : 'text-xs font-semibold text-slate-400';

  if (state.currentQuestion) {
    renderOptionButtons();
  }
}

function openCustomModal() {
  const modal = document.getElementById('customCategoriesModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  updateCategoryCountsAndBadges();
}

function closeCustomModal() {
  const modal = document.getElementById('customCategoriesModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Bind DOM Event Listeners
 */
document.querySelectorAll('.ui-lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setUiLanguage(btn.getAttribute('data-ui-lang')));
});

document.querySelectorAll('.config-card').forEach(card => {
  card.addEventListener('click', () => {
    const group = card.getAttribute('data-config-group');
    const val = card.getAttribute('data-config-value');
    if (!group || !val) return;

    const prevVal = state.config[group];
    state.config[group] = val;

    // Only reset the preloaded articles when selecting a different Language Pool
    if (group === 'pool') {
      if (prevVal !== val) {
        state.prefetchEpoch++;
        state.prefetchQueue = [];
        ensurePrefetchQueue();
      }
      if (val === 'custom') {
        openCustomModal();
      }
    }
    updateConfigCardsUI();
  });
});

document.getElementById('closeCustomModalBtn').addEventListener('click', closeCustomModal);
document.getElementById('applyCustomModalBtn').addEventListener('click', closeCustomModal);
document.getElementById('customCategoriesModal').addEventListener('click', (e) => {
  if (e.target.id === 'customCategoriesModal') closeCustomModal();
});

document.querySelectorAll('.category-checkbox').forEach(cb => {
  cb.addEventListener('change', () => {
    const warn = document.getElementById('categoryWarningMsg');
    if (cb.checked) {
      state.config.customCategories.add(cb.value);
      warn.classList.add('hidden');
    } else {
      if (state.config.customCategories.size <= 1) {
        cb.checked = true;
        warn.classList.remove('hidden');
        return;
      }
      state.config.customCategories.delete(cb.value);
    }
    state.config.pool = 'custom';
    state.prefetchEpoch++;
    state.prefetchQueue = [];
    ensurePrefetchQueue();
    updateConfigCardsUI();
  });
});

document.getElementById('selectAllCategoriesBtn').addEventListener('click', () => {
  ALL_CATEGORIES.forEach(c => state.config.customCategories.add(c));
  document.getElementById('categoryWarningMsg').classList.add('hidden');
  state.config.pool = 'custom';
  state.prefetchEpoch++;
  state.prefetchQueue = [];
  ensurePrefetchQueue();
  updateConfigCardsUI();
});

document.getElementById('resetCategoriesBtn').addEventListener('click', () => {
  state.config.customCategories = new Set(['european', 'asian']);
  document.getElementById('categoryWarningMsg').classList.add('hidden');
  state.config.pool = 'custom';
  state.prefetchEpoch++;
  state.prefetchQueue = [];
  ensurePrefetchQueue();
  updateConfigCardsUI();
});

document.getElementById('alwaysShowNativeToggle').addEventListener('change', (e) => {
  state.config.alwaysShowNative = e.target.checked;
  updateNativeToggleUI();
});

document.getElementById('startGameBtn').addEventListener('click', startNewGame);
document.getElementById('nextRoundBtn').addEventListener('click', handleNextAction);
document.getElementById('openSettingsBtn').addEventListener('click', () => {
  state.status = 'setup';
  showScreen('setup');
  ensurePrefetchQueue();
});
document.getElementById('summaryChangeSettingsBtn').addEventListener('click', () => {
  state.status = 'setup';
  showScreen('setup');
  ensurePrefetchQueue();
});
document.getElementById('summaryPlayAgainBtn').addEventListener('click', startNewGame);

window.addEventListener('keydown', (e) => {
  if (state.status === 'playing' && e.key >= '1' && e.key <= '4') {
    const idx = parseInt(e.key, 10) - 1;
    const buttons = document.getElementById('optionsGrid').querySelectorAll('button');
    if (buttons[idx] && !buttons[idx].disabled) {
      const code = buttons[idx].getAttribute('data-lang-code');
      if (code) handleOptionSelect(code);
    }
  } else if (state.status === 'revealed' && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    handleNextAction();
  }
});

window.onload = function () {
  setUiLanguage(state.config.uiLang);
  showScreen('setup');
  ensurePrefetchQueue();
};
