/**
 * ============================================================================
 * GAME STATE, DISTRACTOR LOGIC & UI CONTROLLER (TEXT & AUDIO MODES)
 * ============================================================================
 */

const state = {
  appMode: 'text', // 'text' (Wikipedia) | 'audio' (TV News)
  status: 'hub',   // 'hub' | 'setup' | 'playing' | 'revealed' | 'gameover'
  config: {
    uiLang: detectBrowserLanguage(),
    mode: 'ten_tries',       // 'ten_tries' | 'endless_3' | 'endless_1'
    pool: 'stable',          // 'stable' | 'experimental' | 'custom'
    difficulty: 'easy',      // 'easy' | 'medium' | 'hard'
    audioTarget: 'language', // 'language' | 'country'
    customCategories: new Set(['european', 'asian']),
    alwaysShowNative: false,
    showBlurredVideo: false,
    videoDisplayMode: 'off', // 'off' | 'blurred' | 'clear' (secret 3rd option)
    unblurredSecretUnlocked: false
  },
  videoToggleClickTimestamps: [],
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
  const code = langObj.code || langObj.langCode;
  const fallbackName = langObj.name || langObj.langName;
  const ui = state.config.uiLang;
  if (ui === 'en') return fallbackName;
  if (MANUAL_LANG_NAMES[ui] && MANUAL_LANG_NAMES[ui][code]) {
    return MANUAL_LANG_NAMES[ui][code];
  }
  try {
    const dn = new Intl.DisplayNames([ui], { type: 'language' });
    const translated = dn.of(code);
    if (translated && translated.toLowerCase() !== code.toLowerCase()) {
      return translated.charAt(0).toUpperCase() + translated.slice(1);
    }
  } catch (e) {}
  return fallbackName;
}

function getLocalizedCountryName(broadcasterObj) {
  const code = broadcasterObj.countryCode;
  const ui = state.config.uiLang;
  if (ui !== 'en' && COUNTRY_TRANSLATIONS[ui] && COUNTRY_TRANSLATIONS[ui][code]) {
    return COUNTRY_TRANSLATIONS[ui][code];
  }
  return broadcasterObj.countryName;
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
 * Builds the 4 language answer options for TEXT mode according to Easy, Medium, or Hard rules.
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
      return similarScriptCount < 2 && sameFamilyCount < 2;
    };

    const diffScriptCousins = shuffleArray(
      clusterCandidates.filter(l => !areScriptsVisuallySimilar(l.script, targetLang.script))
    );
    const sameScriptCousins = shuffleArray(
      clusterCandidates.filter(l => areScriptsVisuallySimilar(l.script, targetLang.script))
    );

    for (const cand of sameScriptCousins) {
      if (canAddMediumCandidate(cand)) {
        distractors.push(cand);
        break;
      }
    }

    for (const cand of diffScriptCousins) {
      if (distractors.length >= 3) break;
      if (canAddMediumCandidate(cand)) {
        distractors.push(cand);
      }
    }

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

    for (const cand of shuffleArray(others)) {
      if (distractors.length >= 3) break;
      if (!distractors.some(d => d.code === cand.code)) {
        const sameFamilyCount = [targetLang, ...distractors].filter(o => o.family === cand.family).length;
        if (sameFamilyCount < 2) distractors.push(cand);
      }
    }
  } else {
    const poolSameScriptFamily = shuffleArray(others.filter(l => l.script === targetLang.script && l.family === targetLang.family));
    const allSameScriptFamily = shuffleArray(allOthers.filter(l => l.script === targetLang.script && l.family === targetLang.family));
    const poolSameScriptOnly = shuffleArray(others.filter(l => l.script === targetLang.script && l.family !== targetLang.family));
    const allSameScriptOnly = shuffleArray(allOthers.filter(l => l.script === targetLang.script && l.family !== targetLang.family));

    const matchingMacroGroups = (typeof HARD_MACRO_SCRIPT_GROUPS !== 'undefined' ? HARD_MACRO_SCRIPT_GROUPS : [])
      .filter(group => group.includes(targetLang.script));
    const macroScripts = new Set();
    matchingMacroGroups.forEach(group => group.forEach(s => {
      if (s !== targetLang.script) macroScripts.add(s);
    }));

    const poolMacroMatches = shuffleArray(others.filter(l => macroScripts.has(l.script)));
    const allMacroMatches = shuffleArray(allOthers.filter(l => macroScripts.has(l.script)));
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

function buildAllDifficultyOptions(targetLang) {
  return {
    easy: buildFourOptions(targetLang, 'easy'),
    medium: buildFourOptions(targetLang, 'medium'),
    hard: buildFourOptions(targetLang, 'hard')
  };
}

/**
 * ============================================================================
 * AUDIO MODE QUESTION & DISTRACTOR GENERATOR (LANGUAGE OR COUNTRY)
 * ============================================================================
 * - In "Guess the Country" mode, avoids repeating the same spoken language
 *   too often (e.g., prevents getting 4 Spanish countries followed by 4 other
 *   Spanish countries) by:
 *   1) Weighting target selection by unique language first rather than raw
 *      broadcaster count (so 9 Spanish or 6 English channels don't dominate).
 *   2) Blocking languages spoken in recent rounds (in 10 Tries Mode, never
 *      repeating a spoken language across the 10 rounds; in Endless Mode,
 *       enforcing a 4-round cooldown on the same spoken language).
 */
function generateAudioRoundQuestion() {
  const isCountryTarget = state.config.audioTarget === 'country';
  const diff = state.config.difficulty;

  const usedKeys = new Set();
  const blockedSpokenLangs = new Set();

  if (state.config.mode === 'ten_tries') {
    state.history.forEach(h => {
      if (h && h.targetKey) usedKeys.add(h.targetKey);
      // In 10 Tries Mode, avoid repeating the same spoken language even in Guess the Country
      if (h && h.spokenLangCode) blockedSpokenLangs.add(h.spokenLangCode);
    });
  } else {
    // In Endless Mode, avoid repeating the same country or the same spoken language from the last 4 rounds
    const recentHistory = state.history.slice(-4);
    recentHistory.forEach(h => {
      if (h && h.targetKey) usedKeys.add(h.targetKey);
      if (h && h.spokenLangCode) blockedSpokenLangs.add(h.spokenLangCode);
    });
  }

  // First filter broadcasters by unused country/language key AND non-repeated spoken language
  let eligibleBroadcasters = TV_NEWS_BROADCASTERS.filter(b => {
    const key = isCountryTarget ? b.countryCode : b.langCode;
    return !usedKeys.has(key) && !blockedSpokenLangs.has(b.langCode);
  });

  // Fallback if cooldown filtered everything out
  if (eligibleBroadcasters.length === 0) {
    eligibleBroadcasters = TV_NEWS_BROADCASTERS.filter(b => {
      const key = isCountryTarget ? b.countryCode : b.langCode;
      return !usedKeys.has(key);
    });
  }
  const poolToPick = eligibleBroadcasters.length > 0 ? eligibleBroadcasters : TV_NEWS_BROADCASTERS;

  // Group eligible broadcasters by langCode so multi-country languages (Spanish, English, Portuguese, Arabic, French)
  // don't appear more frequently than single-country languages.
  const byLanguageMap = new Map();
  poolToPick.forEach(b => {
    if (!byLanguageMap.has(b.langCode)) {
      byLanguageMap.set(b.langCode, []);
    }
    byLanguageMap.get(b.langCode).push(b);
  });
  const candidateLangCodes = Array.from(byLanguageMap.keys());
  const chosenLangCode = candidateLangCodes[Math.floor(Math.random() * candidateLangCodes.length)];
  const broadcastersForLang = byLanguageMap.get(chosenLangCode);
  const targetBroadcaster = broadcastersForLang[Math.floor(Math.random() * broadcastersForLang.length)];

  if (!isCountryTarget) {
    // GUESS THE LANGUAGE IN AUDIO MODE
    const uniqueLangMap = new Map();
    TV_NEWS_BROADCASTERS.forEach(b => {
      if (!uniqueLangMap.has(b.langCode)) {
        uniqueLangMap.set(b.langCode, {
          code: b.langCode,
          name: b.langName,
          native: b.langNative,
          family: b.family,
          region: b.region
        });
      }
    });
    const allAudioLangs = Array.from(uniqueLangMap.values());
    const targetLangObj = uniqueLangMap.get(targetBroadcaster.langCode);
    const others = allAudioLangs.filter(l => l.code !== targetLangObj.code);
    let distractors = [];

    if (diff === 'easy') {
      distractors = shuffleArray(others).slice(0, 3);
    } else if (diff === 'medium') {
      const sameRegion = shuffleArray(others.filter(l => l.region === targetLangObj.region));
      const sameFamily = shuffleArray(others.filter(l => l.family === targetLangObj.family));
      for (const cand of [...sameRegion, ...sameFamily, ...shuffleArray(others)]) {
        if (distractors.length >= 3) break;
        if (!distractors.some(d => d.code === cand.code)) distractors.push(cand);
      }
    } else {
      const sameFamily = shuffleArray(others.filter(l => l.family === targetLangObj.family));
      const sameRegion = shuffleArray(others.filter(l => l.region === targetLangObj.region));
      for (const cand of [...sameFamily, ...sameRegion, ...shuffleArray(others)]) {
        if (distractors.length >= 3) break;
        if (!distractors.some(d => d.code === cand.code)) distractors.push(cand);
      }
    }

    const options = shuffleArray([targetLangObj, ...distractors.slice(0, 3)]).map(l => ({
      code: l.code,
      label: getLocalizedLanguageName(l),
      native: l.native
    }));

    return {
      isAudio: true,
      audioTarget: 'language',
      targetKey: targetBroadcaster.langCode,
      spokenLangCode: targetBroadcaster.langCode,
      broadcaster: targetBroadcaster,
      targetLang: {
        code: targetBroadcaster.langCode,
        name: targetBroadcaster.langName,
        native: targetBroadcaster.langNative,
        script: 'Audio Broadcast',
        family: targetBroadcaster.family
      },
      options
    };
  } else {
    // GUESS THE COUNTRY IN AUDIO MODE
    const countryLangSetMap = new Map();
    const uniqueCountries = new Map();
    TV_NEWS_BROADCASTERS.forEach(b => {
      if (!countryLangSetMap.has(b.countryCode)) {
        countryLangSetMap.set(b.countryCode, new Set());
      }
      countryLangSetMap.get(b.countryCode).add(b.langCode);
      if (!uniqueCountries.has(b.countryCode)) {
        uniqueCountries.set(b.countryCode, b);
      }
    });

    const allCountries = Array.from(uniqueCountries.values());
    const others = allCountries.filter(c => c.countryCode !== targetBroadcaster.countryCode);
    let distractors = [];

    if (diff === 'easy') {
      distractors = shuffleArray(others).slice(0, 3);
    } else if (diff === 'medium') {
      // Medium Mode: countries from the same continent/region or language family,
      // while avoiding filling all 4 slots with the exact same spoken language
      const sameRegionDiffLang = shuffleArray(
        others.filter(c => c.region === targetBroadcaster.region && c.langCode !== targetBroadcaster.langCode)
      );
      const sameFamilyDiffLang = shuffleArray(
        others.filter(c => c.family === targetBroadcaster.family && c.langCode !== targetBroadcaster.langCode)
      );
      const sameRegionAny = shuffleArray(others.filter(c => c.region === targetBroadcaster.region));

      for (const cand of [...sameRegionDiffLang, ...sameFamilyDiffLang, ...sameRegionAny, ...shuffleArray(others)]) {
        if (distractors.length >= 3) break;
        if (!distractors.some(d => d.countryCode === cand.countryCode)) distractors.push(cand);
      }
    } else {
      // Hard Mode: prioritize countries speaking the same language (accent battle) or same language family
      const sameLanguageCountries = shuffleArray(
        others.filter(c => {
          const langSet = countryLangSetMap.get(c.countryCode);
          return langSet && langSet.has(targetBroadcaster.langCode);
        })
      );
      const sameFamilyCountries = shuffleArray(others.filter(c => c.family === targetBroadcaster.family));
      const sameRegionCountries = shuffleArray(others.filter(c => c.region === targetBroadcaster.region));

      for (const cand of [...sameLanguageCountries, ...sameFamilyCountries, ...sameRegionCountries, ...shuffleArray(others)]) {
        if (distractors.length >= 3) break;
        if (!distractors.some(d => d.countryCode === cand.countryCode)) distractors.push(cand);
      }
    }

    const options = shuffleArray([targetBroadcaster, ...distractors.slice(0, 3)]).map(c => ({
      code: c.countryCode,
      label: `${c.flag} ${getLocalizedCountryName(c)}`,
      native: c.countryNative,
      rawCountry: c
    }));

    return {
      isAudio: true,
      audioTarget: 'country',
      targetKey: targetBroadcaster.countryCode,
      spokenLangCode: targetBroadcaster.langCode,
      broadcaster: targetBroadcaster,
      targetLang: {
        code: targetBroadcaster.countryCode,
        name: `${targetBroadcaster.flag} ${getLocalizedCountryName(targetBroadcaster)}`,
        native: targetBroadcaster.countryNative,
        script: targetBroadcaster.langName,
        family: targetBroadcaster.region
      },
      options
    };
  }
}

/**
 * Screen & Mode Switching
 */
function showScreen(screenName) {
  document.getElementById('modeHubScreen').classList.toggle('hidden', screenName !== 'hub');
  document.getElementById('setupScreen').classList.toggle('hidden', screenName !== 'setup');
  document.getElementById('audioSetupScreen').classList.toggle('hidden', screenName !== 'audio_setup');
  document.getElementById('gameScreen').classList.toggle('hidden', screenName !== 'game');
  document.getElementById('summaryScreen').classList.toggle('hidden', screenName !== 'summary');

  const videoFooterBar = document.getElementById('videoToggleFooterBar');
  if (videoFooterBar) {
    videoFooterBar.classList.toggle('hidden', state.appMode !== 'audio' || screenName === 'hub');
  }

  const textBtn = document.getElementById('headerModeTextBtn');
  const audioBtn = document.getElementById('headerModeAudioBtn');
  const brandIcon = document.getElementById('headerBrandIcon');

  if (state.appMode === 'audio') {
    textBtn.className = 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1 text-slate-400 hover:text-white transition';
    audioBtn.className = 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition bg-sky-600 text-white shadow';
    if (brandIcon) brandIcon.className = 'fa-solid fa-tv';
  } else {
    textBtn.className = 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition bg-indigo-600 text-white shadow';
    audioBtn.className = 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1 text-slate-400 hover:text-white transition';
    if (brandIcon) brandIcon.className = 'fa-brands fa-wikipedia-w';
  }
}

function switchAppMode(targetMode) {
  stopAudioPlayback();
  state.appMode = targetMode;
  state.status = 'setup';
  if (targetMode === 'audio') {
    initYouTubeApi();
    showScreen('audio_setup');
  } else {
    showScreen('setup');
    ensurePrefetchQueue();
  }
  updateConfigCardsUI();
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

  const tvCountBadge = document.getElementById('tvChannelCountBadge');
  if (tvCountBadge && typeof TV_NEWS_BROADCASTERS !== 'undefined') {
    tvCountBadge.textContent = `${TV_NEWS_BROADCASTERS.length} TV Channels`;
  }
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

  const gamePrefetchBadge = document.getElementById('gamePrefetchBadge');
  if (gamePrefetchBadge) {
    gamePrefetchBadge.classList.toggle('hidden', state.appMode === 'audio');
  }
}

function renderOptionButtons() {
  if (!state.currentQuestion) return;
  const grid = document.getElementById('optionsGrid');
  const isRevealed = state.status === 'revealed';
  const showNativeNow = state.config.alwaysShowNative || isRevealed;
  const targetCode = state.currentQuestion.targetLang.code;

  grid.innerHTML = state.currentQuestion.options.map((opt, idx) => {
    const primaryLabel = opt.label ? opt.label : getLocalizedLanguageName(opt);
    let btnClasses = 'option-btn w-full rounded-xl sm:rounded-2xl border text-left flex items-center justify-between gap-2 overflow-hidden ';
    let badgeClasses = 'w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ';
    let statusIcon = '';

    if (!isRevealed) {
      btnClasses += 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/60 text-white';
      badgeClasses += 'bg-slate-800 text-slate-300 border border-slate-700';
    } else {
      const isSelected = state.selectedCode === opt.code;
      const isCorrect = opt.code === targetCode;

      if (isSelected && isCorrect) {
        btnClasses += 'bg-emerald-600/25 border-emerald-500 text-white shadow-lg shadow-emerald-600/20';
        badgeClasses += 'bg-emerald-500 text-slate-950';
        statusIcon = '<i class="fa-solid fa-circle-check text-emerald-400 text-base"></i>';
      } else if (isSelected && !isCorrect) {
        btnClasses += 'bg-rose-600/25 border-rose-500 text-white shadow-lg shadow-rose-600/20';
        badgeClasses += 'bg-rose-500 text-white';
        statusIcon = '<i class="fa-solid fa-circle-xmark text-rose-400 text-base"></i>';
      } else if (!isSelected && isCorrect) {
        btnClasses += 'bg-sky-600/25 border-sky-400 text-white shadow-lg shadow-sky-600/20';
        badgeClasses += 'bg-sky-400 text-slate-950';
        statusIcon = '<i class="fa-solid fa-circle-check text-sky-300 text-base"></i>';
      } else {
        btnClasses += 'bg-slate-950/50 border-slate-800/60 text-slate-500 opacity-65';
        badgeClasses += 'bg-slate-900 text-slate-500 border border-slate-800';
      }
    }

    return `
      <button
        type="button"
        data-lang-code="${opt.code}"
        ${isRevealed ? 'disabled' : ''}
        class="${btnClasses}"
      >
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <span class="${badgeClasses}">${idx + 1}</span>
          <div class="min-w-0 flex-1 leading-tight">
            <div class="option-lang-name font-bold truncate">${escapeHtml(primaryLabel)}</div>
            <div class="${showNativeNow ? 'visible opacity-100' : 'invisible opacity-0'} option-native-name text-slate-300/90 font-medium truncate leading-tight transition-opacity">
              ${escapeHtml(opt.native)}
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
  document.getElementById('textWikiCard').classList.remove('hidden');
  document.getElementById('audioPlayerCard').classList.add('hidden');
  document.getElementById('choosePromptText').textContent = dict.choosePromptText;

  const activeDiff = state.config.difficulty;
  const rawParagraph = (activeDiff === 'hard' && questionData.hardParagraph)
    ? questionData.hardParagraph
    : questionData.paragraph;
  const formattedParagraph = formatDisplayParagraph(rawParagraph);

  const optionsByDifficulty = questionData.optionsByDifficulty || buildAllDifficultyOptions(questionData.targetLang);
  const activeOptions = optionsByDifficulty[activeDiff] || buildFourOptions(questionData.targetLang, activeDiff);

  state.currentQuestion = {
    ...questionData,
    isAudio: false,
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

function displayAudioQuestionOnScreen(audioQuestion) {
  const dict = t();
  document.getElementById('textWikiCard').classList.add('hidden');
  document.getElementById('audioPlayerCard').classList.remove('hidden');
  document.getElementById('revealCardContainer').classList.add('hidden');

  document.getElementById('choosePromptText').textContent =
    state.config.audioTarget === 'country' ? dict.chooseAudioCountryPrompt : dict.chooseAudioLangPrompt;

  state.currentQuestion = audioQuestion;
  state.selectedCode = null;
  state.status = 'playing';

  updateHudUI();
  renderOptionButtons();
  syncVideoViewportVisibility();
  loadBroadcasterIntoPlayer(audioQuestion.broadcaster);
}

async function loadNextRound() {
  state.status = 'loading';
  document.getElementById('revealCardContainer').classList.add('hidden');
  document.getElementById('optionsGrid').innerHTML = '';
  updateHudUI();

  if (state.appMode === 'audio') {
    const audioQ = generateAudioRoundQuestion();
    displayAudioQuestionOnScreen(audioQ);
    return;
  }

  const usedInTenTries = state.config.mode === 'ten_tries'
    ? new Set(state.history.map(h => h.targetLang.code))
    : null;

  while (state.prefetchQueue.length > 0) {
    const nextPreloaded = state.prefetchQueue.shift();
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

/**
 * Updates the Reveal Card for Audio Mode with the live YouTube Broadcast Title,
 * Broadcaster Name, Country Flag, and direct "Open on YouTube" link.
 */
function updateAudioRevealDetailsUI() {
  if (!state.currentQuestion || !state.currentQuestion.isAudio) return;
  const dict = t();
  const b = state.currentQuestion.broadcaster;
  const vidTitle = audioEngine.currentVideoTitle || `${b.broadcaster} — Live News Broadcast`;
  const vidId = audioEngine.currentVideoId;
  const ytUrl = vidId
    ? `https://www.youtube.com/watch?v=${vidId}&t=${audioEngine.currentStartSeconds}s`
    : `https://www.youtube.com/channel/${b.channelId}`;

  document.getElementById('revealArticleTitle').textContent = vidTitle;
  document.getElementById('revealLangDetails').textContent = dict.revealAudioMeta(
    b.broadcaster,
    getLocalizedCountryName(b),
    b.flag,
    getLocalizedLanguageName(b),
    b.langNative
  );

  const linkEl = document.getElementById('revealWikiLink');
  linkEl.href = ytUrl;
  document.getElementById('revealExternalLinkIcon').className = 'fa-brands fa-youtube text-rose-400';
  document.getElementById('revealReadArticleText').textContent = dict.revealWatchYoutubeText;
}

function updateRevealCardUI() {
  if (!state.currentQuestion || state.status !== 'revealed') return;
  const dict = t();
  const target = state.currentQuestion.targetLang;
  const isCorrect = state.selectedCode === target.code;

  const banner = document.getElementById('revealStatusBanner');
  if (isCorrect) {
    banner.className = 'inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    banner.innerHTML = `<i class="fa-solid fa-check"></i> <span>${escapeHtml(dict.revealCorrect)}</span>`;
  } else {
    banner.className = 'inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30';
    banner.innerHTML = `<i class="fa-solid fa-xmark"></i> <span>${escapeHtml(dict.revealWrong)}</span>`;
  }

  if (state.currentQuestion.isAudio) {
    updateAudioRevealDetailsUI();
  } else {
    document.getElementById('revealArticleTitle').textContent = state.currentQuestion.articleTitle;
    document.getElementById('revealLangDetails').textContent = dict.revealLangMeta(
      getLocalizedLanguageName(target),
      target.native,
      target.script,
      target.family
    );

    const wikiLink = document.getElementById('revealWikiLink');
    wikiLink.href = state.currentQuestion.articleUrl;
    document.getElementById('revealExternalLinkIcon').className = 'fa-brands fa-wikipedia-w';
    document.getElementById('revealReadArticleText').textContent = dict.revealReadArticleText;
  }

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
  const chosenOpt = state.currentQuestion.options.find(o => o.code === chosenCode) || target;
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

  if (state.currentQuestion.isAudio) {
    syncVideoViewportVisibility();
    const b = state.currentQuestion.broadcaster;
    const vidId = audioEngine.currentVideoId;
    const ytUrl = vidId
      ? `https://www.youtube.com/watch?v=${vidId}&t=${audioEngine.currentStartSeconds}s`
      : `https://www.youtube.com/channel/${b.channelId}`;

    state.history.push({
      round: state.round,
      isAudio: true,
      targetKey: state.currentQuestion.targetKey,
      spokenLangCode: state.currentQuestion.spokenLangCode || b.langCode,
      targetLang: target,
      chosenLang: { code: chosenOpt.code, name: chosenOpt.label || chosenOpt.name, native: chosenOpt.native },
      isCorrect,
      articleTitle: audioEngine.currentVideoTitle || b.broadcaster,
      articleUrl: ytUrl
    });
  } else {
    state.history.push({
      round: state.round,
      isAudio: false,
      targetLang: target,
      chosenLang: chosenOpt,
      isCorrect,
      articleTitle: state.currentQuestion.articleTitle,
      articleUrl: state.currentQuestion.articleUrl
    });
    ensurePrefetchQueue();
  }

  updateHudUI();
  renderOptionButtons();
  updateRevealCardUI();
}

function handleNextAction() {
  if (state.status !== 'revealed') return;
  const isTenFinished = state.config.mode === 'ten_tries' && state.round >= state.maxRounds;
  const isEndlessOver = isEndlessMode() && state.lives <= 0;

  if (isTenFinished || isEndlessOver) {
    stopAudioPlayback();
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
    const targetName = item.isAudio ? item.targetLang.name : getLocalizedLanguageName(item.targetLang);
    const chosenName = item.isAudio ? item.chosenLang.name : getLocalizedLanguageName(item.chosenLang);
    const linkIcon = item.isAudio ? 'fa-brands fa-youtube text-rose-400' : 'fa-brands fa-wikipedia-w';

    return `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm">
        <div class="flex items-center gap-3">
          <span class="w-7 h-7 rounded-lg border flex items-center justify-center font-bold shrink-0 ${badgeCls}">
            <i class="fa-solid ${icon}"></i>
          </span>
          <div>
            <div class="font-bold text-white">
              ${escapeHtml(dict.historyRound(item.round))}: ${escapeHtml(targetName)}
              <span class="text-slate-400 font-normal">(${escapeHtml(item.targetLang.native)})</span>
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
          <i class="${linkIcon}"></i>
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
      ? 'ui-lang-btn px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold bg-indigo-600 text-white shadow'
      : 'ui-lang-btn px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-white transition';
  });

  const dict = t();
  const mapIds = [
    'headerTitle', 'headerSubtitle', 'modeSwitchText', 'modeSwitchAudio',
    'hubHeading', 'hubSubheading', 'hubTextTitle', 'hubTextBadge', 'hubTextDesc',
    'hubAudioTitle', 'hubAudioBadge', 'hubAudioDesc',
    'setupHeading', 'setupSubheading', 'audioSetupHeading', 'audioSetupSubheading',
    'labelAudioTarget', 'targetLangTitle', 'targetLangDesc', 'targetCountryTitle', 'targetCountryDesc',
    'labelGameMode', 'modeTenTitle', 'modeTenDesc', 'modeEndless3Title', 'modeEndless3Desc',
    'modeEndless1Title', 'modeEndless1Desc', 'labelLangPool', 'poolStableTitle', 'poolStableDesc',
    'poolExpTitle', 'poolExpDesc', 'poolCustomTitle', 'poolCustomDesc',
    'labelDifficulty', 'diffEasyTitle', 'diffEasyDesc', 'diffMedTitle', 'diffMedDesc',
    'diffHardTitle', 'diffHardDesc', 'startGameBtnText', 'snippetHeaderBadge', 'audioHeaderBadge',
    'audioWaveHint', 'scannerStatusTitle', 'scannerStatusSub', 'keyboardHintText',
    'sumScoreLabel', 'sumAccLabel', 'sumRoundsLabel', 'sumStreakLabel', 'sumHistoryHeading',
    'sumChangeSettingsText', 'sumPlayAgainText', 'videoToggleTitle', 'videoToggleSub',
    'nativeToggleTitle', 'nativeToggleSub',
    'modalTitle', 'modalSubtitle', 'catEuroTitle', 'catEuroDesc', 'catAsianTitle', 'catAsianDesc',
    'catAfricanTitle', 'catAfricanDesc', 'catAustroTitle', 'catAustroDesc', 'catIndigTitle', 'catIndigDesc',
    'categoryWarningText'
  ];
  mapIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && typeof dict[id] === 'string') el.textContent = dict[id];
  });

  document.getElementById('audioLabelGameMode').textContent = dict.labelGameMode;
  document.getElementById('audioModeTenTitle').textContent = dict.modeTenTitle;
  document.getElementById('audioModeTenDesc').textContent = dict.modeTenDesc;
  document.getElementById('audioModeEndless3Title').textContent = dict.modeEndless3Title;
  document.getElementById('audioModeEndless3Desc').textContent = dict.modeEndless3Desc;
  document.getElementById('audioModeEndless1Title').textContent = dict.modeEndless1Title;
  document.getElementById('audioModeEndless1Desc').textContent = dict.modeEndless1Desc;
  document.getElementById('audioLabelDifficulty').textContent = dict.labelDifficulty;
  document.getElementById('audioDiffEasyTitle').textContent = dict.diffEasyTitle;
  document.getElementById('audioDiffEasyDesc').textContent = dict.diffEasyDesc;
  document.getElementById('audioDiffMedTitle').textContent = dict.diffMedTitle;
  document.getElementById('audioDiffMedDesc').textContent = dict.diffMedDesc;
  document.getElementById('audioDiffHardTitle').textContent = dict.diffHardTitle;
  document.getElementById('audioDiffHardDesc').textContent = dict.diffHardDesc;
  document.getElementById('startAudioGameBtnText').textContent = dict.startGameBtnText;
  document.getElementById('audioSkipBtnText').textContent = dict.audioSkipBtn;
  const newClipBtnTextEl = document.getElementById('audioNewClipBtnText');
  if (newClipBtnTextEl) newClipBtnTextEl.textContent = dict.audioNewClipBtn;
  document.getElementById('audioBlurredBadgeText').textContent = dict.audioBlurredBadge;

  document.getElementById('selectAllCategoriesBtn').textContent = dict.selectAllText;
  document.getElementById('resetCategoriesBtn').textContent = dict.resetText;
  document.getElementById('applyCustomModalBtn').textContent = dict.doneText;

  updateVideoToggleUI();
  updateNativeToggleUI();
  updateConfigCardsUI();
  updatePrefetchBadgesUI();
  updateHudUI();
  updateAudioControlsUI();

  if (state.currentQuestion) {
    if (!state.currentQuestion.isAudio) {
      document.getElementById('charCountBadge').textContent = dict.charsUnit(state.currentQuestion.paragraph.length);
      document.getElementById('choosePromptText').textContent = dict.choosePromptText;
    } else {
      document.getElementById('choosePromptText').textContent =
        state.config.audioTarget === 'country' ? dict.chooseAudioCountryPrompt : dict.chooseAudioLangPrompt;
      state.currentQuestion.options.forEach(opt => {
        if (opt.rawCountry) {
          opt.label = `${opt.rawCountry.flag} ${getLocalizedCountryName(opt.rawCountry)}`;
        }
      });
    }
    renderOptionButtons();
    if (state.status === 'revealed') updateRevealCardUI();
  }
  if (state.status === 'gameover') {
    renderSummaryScreen();
  }
}

/**
 * Updates the Video Display Toggle UI for all 3 states:
 * - 'off': Audio Only
 * - 'blurred': Blurred Video
 * - 'clear': Remove Blur (Secret 3rd option unlocked by 6 fast clicks)
 */
function updateVideoToggleUI() {
  const dict = t();
  const labelEl = document.getElementById('videoToggleStateText');
  const checkboxEl = document.getElementById('showBlurredVideoToggle');
  const pillEl = document.getElementById('videoToggleSwitchTrack');
  if (!labelEl) return;

  const mode = state.config.videoDisplayMode || 'off';
  if (checkboxEl) {
    checkboxEl.checked = mode !== 'off';
  }

  if (mode === 'clear') {
    labelEl.textContent = dict.videoStateClear || 'Remove Blur 🔓';
    labelEl.className = 'text-xs font-extrabold text-emerald-400';
    if (pillEl) {
      pillEl.className = "w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative peer-checked:bg-emerald-500 border border-emerald-400/60";
    }
  } else if (mode === 'blurred') {
    labelEl.textContent = dict.videoStateOn;
    labelEl.className = 'text-xs font-bold text-sky-400';
    if (pillEl) {
      pillEl.className = "w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative peer-checked:bg-sky-600 border border-slate-700";
    }
  } else {
    labelEl.textContent = dict.videoStateOff;
    labelEl.className = 'text-xs font-semibold text-slate-400';
    if (pillEl) {
      pillEl.className = "w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative peer-checked:bg-sky-600 border border-slate-700";
    }
  }

  syncVideoViewportVisibility();
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

document.getElementById('chooseTextModeCard').addEventListener('click', () => switchAppMode('text'));
document.getElementById('chooseAudioModeCard').addEventListener('click', () => switchAppMode('audio'));
document.getElementById('headerModeTextBtn').addEventListener('click', () => switchAppMode('text'));
document.getElementById('headerModeAudioBtn').addEventListener('click', () => switchAppMode('audio'));
document.getElementById('brandHomeBtn').addEventListener('click', () => {
  stopAudioPlayback();
  state.status = 'hub';
  showScreen('hub');
});

document.querySelectorAll('.config-card').forEach(card => {
  card.addEventListener('click', () => {
    const group = card.getAttribute('data-config-group');
    const val = card.getAttribute('data-config-value');
    if (!group || !val) return;

    const prevVal = state.config[group];
    state.config[group] = val;

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

/**
 * Video Display Toggle Handler with Secret 6-Fast-Clicks "Remove Blur" Mode
 */
document.getElementById('showBlurredVideoToggle').addEventListener('change', () => {
  const now = Date.now();
  state.videoToggleClickTimestamps.push(now);
  state.videoToggleClickTimestamps = state.videoToggleClickTimestamps.filter(ts => now - ts <= 2200);

  if (state.videoToggleClickTimestamps.length >= 6) {
    // 6 fast clicks detected! Unlock & activate the 3rd option: "Remove Blur"
    state.config.unblurredSecretUnlocked = true;
    state.config.videoDisplayMode = 'clear';
    state.config.showBlurredVideo = true;
    state.videoToggleClickTimestamps = [];
  } else if (state.config.unblurredSecretUnlocked) {
    // Cycle through all 3 modes once unlocked: 'off' -> 'blurred' -> 'clear' -> 'off'
    const current = state.config.videoDisplayMode || 'off';
    const nextMode = current === 'off' ? 'blurred' : (current === 'blurred' ? 'clear' : 'off');
    state.config.videoDisplayMode = nextMode;
    state.config.showBlurredVideo = nextMode !== 'off';
  } else {
    // Standard 2-state toggle ('off' <-> 'blurred')
    const current = state.config.videoDisplayMode || 'off';
    const nextMode = current === 'off' ? 'blurred' : 'off';
    state.config.videoDisplayMode = nextMode;
    state.config.showBlurredVideo = nextMode === 'blurred';
  }

  updateVideoToggleUI();
});

document.getElementById('alwaysShowNativeToggle').addEventListener('change', (e) => {
  state.config.alwaysShowNative = e.target.checked;
  updateNativeToggleUI();
});

// Audio Player Control Buttons
document.getElementById('audioPlayPauseBtn').addEventListener('click', toggleAudioPlayPause);
document.getElementById('audioSkip15Btn').addEventListener('click', skipAudioForward15s);
document.getElementById('audioNewClipBtn').addEventListener('click', () => {
  if (audioEngine.currentBroadcaster) {
    switchSameBroadcasterClip();
  }
});
document.getElementById('audioMuteBtn').addEventListener('click', toggleAudioMute);

document.getElementById('startGameBtn').addEventListener('click', startNewGame);
document.getElementById('startAudioGameBtn').addEventListener('click', startNewGame);
document.getElementById('nextRoundBtn').addEventListener('click', handleNextAction);

document.getElementById('openSettingsBtn').addEventListener('click', () => {
  stopAudioPlayback();
  state.status = 'setup';
  if (state.appMode === 'audio') {
    showScreen('audio_setup');
  } else {
    showScreen('setup');
    ensurePrefetchQueue();
  }
});

document.getElementById('summaryChangeSettingsBtn').addEventListener('click', () => {
  stopAudioPlayback();
  state.status = 'setup';
  if (state.appMode === 'audio') {
    showScreen('audio_setup');
  } else {
    showScreen('setup');
    ensurePrefetchQueue();
  }
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
  showScreen('hub');
  ensurePrefetchQueue();
};
