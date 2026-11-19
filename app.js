/**
 * ============================================================================
 * GAME STATE, DISTRACTOR ALGORITHMS & UI CONTROLLER
 * Supports both Text Mode (Wikipedia) and Audio Mode (World TV News)
 * ============================================================================
 */

const DEFAULT_AUDIO_LANG_LEAVES = ['euro_romance', 'euro_germanic', 'euro_slavic', 'euro_others', 'asia_east'];
const ALL_AUDIO_LANG_LEAVES = [
  'euro_romance', 'euro_germanic', 'euro_slavic', 'euro_others',
  'asia_east', 'asia_se', 'asia_south',
  'afr_west_asia_other'
];

const DEFAULT_AUDIO_TERR_LEAVES = ['eu_west', 'eu_north', 'eu_east_balkan', 'ao_east_asia', 'ao_oceania'];
const ALL_AUDIO_TERR_LEAVES = [
  'am_north', 'am_carib_central', 'am_south',
  'eu_west', 'eu_north', 'eu_east_balkan',
  'ao_east_asia', 'ao_se_asia', 'ao_south_asia', 'ao_oceania',
  'afwa_subsaharan', 'afwa_mena_caucasus'
];

const ANGLOSPHERE_COUNTRY_CODES = new Set(['US', 'CA', 'GB', 'IE', 'AU', 'NZ']);

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
    audioLangCategories: new Set(DEFAULT_AUDIO_LANG_LEAVES),
    audioTerritories: new Set(DEFAULT_AUDIO_TERR_LEAVES),
    audioTerritoryPreset: null, // null | 'iberian' | 'anglosphere'
    crossContinentTrap: true,
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
  maxLives: 3,
  history: [],
  currentQuestion: null,
  prefetchQueue: [],
  prefetchTargetSize: 5,
  prefetchInFlight: false,
  prefetchEpoch: 0,
  textLoadRequestId: 0
};

/**
 * Helper: Returns active UI translation dictionary
 */
function t() {
  return I18N[state.config.uiLang] || I18N.en;
}

/**
 * Translates any Wikipedia language name into the selected UI language ('en', 'es', 'pt').
 */
function getLocalizedLanguageName(langObj) {
  const uiLang = state.config.uiLang;
  if (uiLang === 'en') return langObj.name;
  if (MANUAL_LANG_NAMES[uiLang] && MANUAL_LANG_NAMES[uiLang][langObj.code]) {
    return MANUAL_LANG_NAMES[uiLang][langObj.code];
  }
  try {
    const displayNames = new Intl.DisplayNames([uiLang], { type: 'language' });
    const localized = displayNames.of(langObj.code);
    if (localized && localized.toLowerCase() !== langObj.code.toLowerCase()) {
      return localized.charAt(0).toUpperCase() + localized.slice(1);
    }
  } catch (e) {}
  return langObj.name;
}

/**
 * Translates a country name into the active UI language ('en', 'es', 'pt').
 */
function getLocalizedCountryName(broadcasterObj) {
  const uiLang = state.config.uiLang;
  if (uiLang === 'en') return broadcasterObj.countryName;
  if (COUNTRY_TRANSLATIONS[uiLang] && COUNTRY_TRANSLATIONS[uiLang][broadcasterObj.countryCode]) {
    return COUNTRY_TRANSLATIONS[uiLang][broadcasterObj.countryCode];
  }
  try {
    const displayNames = new Intl.DisplayNames([uiLang], { type: 'region' });
    const localized = displayNames.of(broadcasterObj.countryCode);
    if (localized) return localized;
  } catch (e) {}
  return broadcasterObj.countryName;
}

/**
 * Returns the active list of Wikipedia language objects based on the selected Text pool.
 */
function getActiveLanguagePool() {
  if (state.config.pool === 'stable') {
    return WIKI_LANGUAGES.filter(l => l.pool === 'stable');
  }
  if (state.config.pool === 'experimental') {
    return WIKI_LANGUAGES;
  }
  const selected = state.config.customCategories;
  const filtered = WIKI_LANGUAGES.filter(l => l.cats.some(c => selected.has(c)));
  return filtered.length >= 4 ? filtered : WIKI_LANGUAGES.filter(l => l.pool === 'stable');
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
 * ============================================================================
 * TEXT MODE DISTRACTOR SELECTION ALGORITHMS (Easy, Medium, Hard)
 * ============================================================================
 */
function selectTextDistractorsForDifficulty(targetLang, difficulty) {
  const activePool = getActiveLanguagePool();
  const othersFromActive = activePool.filter(l => l.code !== targetLang.code);
  const allOthers = WIKI_LANGUAGES.filter(l => l.code !== targetLang.code);

  if (difficulty === 'easy') {
    const source = othersFromActive.length >= 3 ? othersFromActive : allOthers;
    return shuffleArray(source).slice(0, 3);
  }

  if (difficulty === 'medium') {
    const cousinSet = new Set();
    for (const cluster of MEDIUM_COUSIN_CLUSTERS) {
      if (cluster.includes(targetLang.code)) {
        cluster.forEach(code => {
          if (code !== targetLang.code) cousinSet.add(code);
        });
      }
    }

    const activeCousins = othersFromActive.filter(l => cousinSet.has(l.code));
    const globalCousins = allOthers.filter(l => cousinSet.has(l.code));
    const diffScriptCousins = activeCousins.filter(l => l.script !== targetLang.script);
    const sameFamilyDiffScript = othersFromActive.filter(
      l => l.family === targetLang.family && l.script !== targetLang.script
    );

    const chosen = [];
    const addUnique = (candidates) => {
      for (const c of shuffleArray(candidates)) {
        if (chosen.length >= 3) break;
        if (!chosen.some(item => item.code === c.code)) {
          chosen.push(c);
        }
      }
    };

    addUnique(diffScriptCousins);
    addUnique(sameFamilyDiffScript);
    addUnique(activeCousins);
    addUnique(globalCousins);
    addUnique(othersFromActive);
    addUnique(allOthers);

    return chosen.slice(0, 3);
  }

  // HARD MODE
  const sameScriptActive = othersFromActive.filter(l => l.script === targetLang.script);
  const sameScriptGlobal = allOthers.filter(l => l.script === targetLang.script);
  const sameFamilyAndScript = sameScriptActive.filter(l => l.family === targetLang.family);

  let macroScripts = [];
  for (const group of HARD_MACRO_SCRIPT_GROUPS) {
    if (group.includes(targetLang.script)) {
      macroScripts = group;
      break;
    }
  }
  const macroScriptCandidates = macroScripts.length > 0
    ? allOthers.filter(l => macroScripts.includes(l.script))
    : [];

  const chosen = [];
  const addUnique = (candidates) => {
    for (const c of shuffleArray(candidates)) {
      if (chosen.length >= 3) break;
      if (!chosen.some(item => item.code === c.code)) {
        chosen.push(c);
      }
    }
  };

  addUnique(sameFamilyAndScript);
  addUnique(sameScriptActive);
  addUnique(sameScriptGlobal);
  addUnique(macroScriptCandidates);
  addUnique(othersFromActive);
  addUnique(allOthers);

  return chosen.slice(0, 3);
}

function buildAllDifficultyOptions(targetLang) {
  return {
    easy: shuffleArray([targetLang, ...selectTextDistractorsForDifficulty(targetLang, 'easy')]),
    medium: shuffleArray([targetLang, ...selectTextDistractorsForDifficulty(targetLang, 'medium')]),
    hard: shuffleArray([targetLang, ...selectTextDistractorsForDifficulty(targetLang, 'hard')])
  };
}

/**
 * ============================================================================
 * AUDIO POOL FILTERING (LANGUAGE TREE & TERRITORY TREE + CROSS-CONTINENT TRAP)
 * ============================================================================
 */
function getActiveAudioBroadcastersForLangMode() {
  const activeCats = state.config.audioLangCategories;
  const filtered = TV_NEWS_BROADCASTERS.filter(b => activeCats.has(b.langCat));
  return filtered.length > 0 ? filtered : TV_NEWS_BROADCASTERS;
}

function getActiveAudioBroadcastersForCountryMode() {
  const preset = state.config.audioTerritoryPreset;
  if (preset === 'iberian') {
    const iberianList = TV_NEWS_BROADCASTERS.filter(
      b => b.langCode === 'es' || b.langCode === 'pt'
    );
    return iberianList.length > 0 ? iberianList : TV_NEWS_BROADCASTERS;
  }
  if (preset === 'anglosphere') {
    const angloList = TV_NEWS_BROADCASTERS.filter(
      b => ANGLOSPHERE_COUNTRY_CODES.has(b.countryCode) && b.langCode === 'en'
    );
    return angloList.length > 0 ? angloList : TV_NEWS_BROADCASTERS;
  }

  const activeTerr = state.config.audioTerritories;
  const directBroadcasters = TV_NEWS_BROADCASTERS.filter(b => activeTerr.has(b.territory));
  const baseList = directBroadcasters.length > 0 ? directBroadcasters : TV_NEWS_BROADCASTERS;

  if (!state.config.crossContinentTrap) {
    return baseList;
  }

  // Cross-Continent Trap: find all languages spoken in the selected territories,
  // and allow broadcasters from OTHER continents that share any of those languages!
  const allowedSharedLangs = new Set(baseList.map(b => b.langCode));
  const mergedMap = new Map();
  baseList.forEach(b => mergedMap.set(b.id, b));

  TV_NEWS_BROADCASTERS.forEach(b => {
    if (allowedSharedLangs.has(b.langCode) && !mergedMap.has(b.id)) {
      mergedMap.set(b.id, b);
    }
  });

  return Array.from(mergedMap.values());
}

/**
 * ============================================================================
 * AUDIO MODE QUESTION & DISTRACTOR GENERATOR (LANGUAGE OR COUNTRY)
 * ============================================================================
 */
function generateAudioRoundQuestion() {
  const isCountryTarget = state.config.audioTarget === 'country';
  const diff = state.config.difficulty;

  // Pool of broadcasters filtered by the user's Audio Language Tree or Territory Tree (+ Trap)
  const rawActivePool = isCountryTarget
    ? getActiveAudioBroadcastersForCountryMode()
    : getActiveAudioBroadcastersForLangMode();

  // Exclude broadcasters whose clips have all failed during this session
  const healthyPool = rawActivePool.filter(b => {
    if (audioEngine.failedBroadcasterIds && audioEngine.failedBroadcasterIds.has(b.id)) {
      return false;
    }
    return typeof getAvailableClipsForBroadcaster === 'function'
      ? getAvailableClipsForBroadcaster(b).length > 0
      : true;
  });
  const activePool = healthyPool.length > 0 ? healthyPool : rawActivePool;

  const usedKeys = new Set();
  const blockedSpokenLangs = new Set();

  if (state.config.mode === 'ten_tries') {
    state.history.forEach(h => {
      if (h && h.targetKey) usedKeys.add(h.targetKey);
      if (h && h.spokenLangCode) blockedSpokenLangs.add(h.spokenLangCode);
    });
  } else {
    const recentHistory = state.history.slice(-4);
    recentHistory.forEach(h => {
      if (h && h.targetKey) usedKeys.add(h.targetKey);
      if (h && h.spokenLangCode) blockedSpokenLangs.add(h.spokenLangCode);
    });
  }

  let eligibleBroadcasters = activePool.filter(b => {
    const key = isCountryTarget ? b.countryCode : b.langCode;
    return !usedKeys.has(key) && !blockedSpokenLangs.has(b.langCode);
  });

  if (eligibleBroadcasters.length === 0) {
    eligibleBroadcasters = activePool.filter(b => {
      const key = isCountryTarget ? b.countryCode : b.langCode;
      return !usedKeys.has(key);
    });
  }
  const poolToPick = eligibleBroadcasters.length > 0 ? eligibleBroadcasters : activePool;

  // Uniform target weighting:
  // - In Country Mode, group by unique `countryCode` first so multi-language countries
  //   (Spain, Switzerland, Canada, Belgium, UK, Ireland, Indonesia) get equal odds.
  // - In Language Mode, group by unique `langCode` first so multi-country languages
  //   (Spanish, English, Portuguese) don't dominate.
  let targetBroadcaster = null;
  if (isCountryTarget) {
    const byCountryMap = new Map();
    poolToPick.forEach(b => {
      if (!byCountryMap.has(b.countryCode)) {
        byCountryMap.set(b.countryCode, []);
      }
      byCountryMap.get(b.countryCode).push(b);
    });
    const candidateCountries = Array.from(byCountryMap.keys());
    const chosenCountryCode = candidateCountries[Math.floor(Math.random() * candidateCountries.length)];
    const broadcastersForCountry = byCountryMap.get(chosenCountryCode);
    targetBroadcaster = broadcastersForCountry[Math.floor(Math.random() * broadcastersForCountry.length)];
  } else {
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
    targetBroadcaster = broadcastersForLang[Math.floor(Math.random() * broadcastersForLang.length)];
  }

  if (!isCountryTarget) {
    // GUESS THE LANGUAGE IN AUDIO MODE
    const uniqueLangMap = new Map();
    rawActivePool.forEach(b => {
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
    // Ensure at least 4 languages exist for distractors even if user picked a tiny single-language branch
    if (uniqueLangMap.size < 4) {
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
    }

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
    rawActivePool.forEach(b => {
      if (!countryLangSetMap.has(b.countryCode)) {
        countryLangSetMap.set(b.countryCode, new Set());
      }
      countryLangSetMap.get(b.countryCode).add(b.langCode);
      if (!uniqueCountries.has(b.countryCode)) {
        uniqueCountries.set(b.countryCode, b);
      }
    });

    // Ensure at least 4 countries exist for distractors
    if (uniqueCountries.size < 4) {
      TV_NEWS_BROADCASTERS.forEach(b => {
        if (!countryLangSetMap.has(b.countryCode)) {
          countryLangSetMap.set(b.countryCode, new Set());
        }
        countryLangSetMap.get(b.countryCode).add(b.langCode);
        if (!uniqueCountries.has(b.countryCode)) {
          uniqueCountries.set(b.countryCode, b);
        }
      });
    }

    const allCountries = Array.from(uniqueCountries.values());
    const others = allCountries.filter(c => c.countryCode !== targetBroadcaster.countryCode);
    let distractors = [];

    if (diff === 'easy') {
      distractors = shuffleArray(others).slice(0, 3);
    } else if (diff === 'medium') {
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
      native: typeof getCanonicalCountryNative === 'function' ? getCanonicalCountryNative(c) : c.countryNative,
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
        native: typeof getCanonicalCountryNative === 'function'
          ? getCanonicalCountryNative(targetBroadcaster)
          : targetBroadcaster.countryNative,
        script: targetBroadcaster.langName,
        family: targetBroadcaster.region
      },
      options
    };
  }
}

/**
 * ============================================================================
 * UI & VIEW MANAGEMENT (HUB, TEXT SETUP, AUDIO SETUP, GAMEPLAY, SUMMARY)
 * ============================================================================
 */
function showView(viewName) {
  const views = ['modeHubScreen', 'setupScreen', 'audioSetupScreen', 'gameScreen', 'summaryScreen'];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== viewName);
  });

  // Show Video Toggle bar above Native Toggle bar whenever in Audio Mode
  const videoFooterBar = document.getElementById('videoToggleFooterBar');
  if (videoFooterBar) {
    videoFooterBar.classList.toggle('hidden', state.appMode !== 'audio');
  }

  // Toggle Text Card vs Audio Player Card inside gameScreen
  const textCard = document.getElementById('textWikiCard');
  const audioCard = document.getElementById('audioPlayerCard');
  const gamePrefetch = document.getElementById('gamePrefetchBadge');
  if (textCard && audioCard) {
    textCard.classList.toggle('hidden', state.appMode !== 'text');
    audioCard.classList.toggle('hidden', state.appMode !== 'audio');
  }
  if (gamePrefetch) {
    gamePrefetch.classList.toggle('hidden', state.appMode !== 'text');
  }

  updateHeaderModeSwitcherUI();
}

function updateHeaderModeSwitcherUI() {
  const textBtn = document.getElementById('headerModeTextBtn');
  const audioBtn = document.getElementById('headerModeAudioBtn');
  const brandIcon = document.getElementById('headerBrandIcon');

  if (state.appMode === 'audio') {
    if (textBtn) {
      textBtn.className = 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1 text-slate-400 hover:text-white transition';
    }
    if (audioBtn) {
      audioBtn.className = 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition bg-sky-600 text-white';
    }
    if (brandIcon) {
      brandIcon.className = 'fa-solid fa-tv';
    }
  } else {
    if (textBtn) {
      textBtn.className = 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition bg-indigo-600 text-white';
    }
    if (audioBtn) {
      audioBtn.className = 'px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1 text-slate-400 hover:text-white transition';
    }
    if (brandIcon) {
      brandIcon.className = 'fa-brands fa-wikipedia-w';
    }
  }
}

function switchAppMode(targetMode) {
  if (targetMode !== 'text' && targetMode !== 'audio') return;
  state.textLoadRequestId++;
  stopAudioPlayback();
  state.appMode = targetMode;
  state.status = 'setup';
  updateConfigCardsUI();

  if (targetMode === 'audio') {
    initYouTubeApi();
    showView('audioSetupScreen');
  } else {
    showView('setupScreen');
    ensurePrefetchQueue();
  }
}

function updateConfigCardsUI() {
  document.querySelectorAll('.config-card').forEach(card => {
    const group = card.getAttribute('data-config-group');
    const val = card.getAttribute('data-config-value');
    if (state.config[group] === val) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
  updateCategoryCountsAndBadges();
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

  // Dynamic Wikipedia Stable & Experimental Pool Badges
  const stableBadge = document.getElementById('poolStableCountBadge');
  const expBadge = document.getElementById('poolExpCountBadge');
  if (stableBadge) {
    stableBadge.textContent = WIKI_LANGUAGES.filter(l => l.pool === 'stable').length;
  }
  if (expBadge) {
    expBadge.textContent = WIKI_LANGUAGES.length;
  }

  const customTotal = WIKI_LANGUAGES.filter(l => l.cats.some(c => state.config.customCategories.has(c))).length;
  document.getElementById('customPoolBadge').textContent = dict.customBadgeText(state.config.customCategories.size, customTotal);

  document.querySelectorAll('.category-checkbox').forEach(cb => {
    cb.checked = state.config.customCategories.has(cb.value);
  });

  const tvCountBadge = document.getElementById('tvChannelCountBadge');
  if (tvCountBadge && typeof TV_NEWS_BROADCASTERS !== 'undefined') {
    tvCountBadge.textContent = typeof dict.tvChannelCountBadge === 'function'
      ? dict.tvChannelCountBadge(TV_NEWS_BROADCASTERS.length)
      : `${TV_NEWS_BROADCASTERS.length} TV Channels`;
  }

  updateAudioTreeCountsAndBadges();
}

/**
 * Synchronizes parent/child tree checkboxes, counts, and setup card badges
 * for both the Audio Language Tree Modal and the Audio Territory Tree Modal.
 */
function updateAudioTreeCountsAndBadges() {
  if (typeof TV_NEWS_BROADCASTERS === 'undefined') return;
  const dict = t();

  // 1. Audio Language Tree Counts & Checkboxes
  const langLeafCounts = {};
  ALL_AUDIO_LANG_LEAVES.forEach(leaf => {
    const uniqueLangs = new Set(
      TV_NEWS_BROADCASTERS.filter(b => b.langCat === leaf).map(b => b.langCode)
    );
    langLeafCounts[leaf] = uniqueLangs.size;
    const el = document.getElementById(`langLeafCount_${leaf}`);
    if (el) el.textContent = `${uniqueLangs.size}`;
  });

  const euroLangTotal = (langLeafCounts.euro_romance || 0) + (langLeafCounts.euro_germanic || 0) +
    (langLeafCounts.euro_slavic || 0) + (langLeafCounts.euro_others || 0);
  const asiaLangTotal = (langLeafCounts.asia_east || 0) + (langLeafCounts.asia_se || 0) + (langLeafCounts.asia_south || 0);
  const afwaLangTotal = langLeafCounts.afr_west_asia_other || 0;

  const pEuro = document.getElementById('langParentCountEuro');
  const pAsia = document.getElementById('langParentCountAsia');
  const pAfwa = document.getElementById('langParentCountAfwa');
  if (pEuro) pEuro.textContent = euroLangTotal;
  if (pAsia) pAsia.textContent = asiaLangTotal;
  if (pAfwa) pAfwa.textContent = afwaLangTotal;

  document.querySelectorAll('.audio-lang-leaf').forEach(cb => {
    cb.checked = state.config.audioLangCategories.has(cb.value);
  });
  document.querySelectorAll('.audio-tree-parent').forEach(parentCb => {
    const parentKey = parentCb.getAttribute('data-parent');
    const children = Array.from(document.querySelectorAll(`.audio-lang-leaf[data-parent="${parentKey}"]`));
    const checkedCount = children.filter(c => c.checked).length;
    parentCb.checked = checkedCount === children.length && children.length > 0;
    parentCb.indeterminate = checkedCount > 0 && checkedCount < children.length;
  });

  const activeLangPool = getActiveAudioBroadcastersForLangMode();
  const activeUniqueLangCount = new Set(activeLangPool.map(b => b.langCode)).size;
  const langTreeBadge = document.getElementById('audioLangTreeBadge');
  if (langTreeBadge) {
    langTreeBadge.textContent = typeof dict.audioLangBadgeText === 'function'
      ? dict.audioLangBadgeText(state.config.audioLangCategories.size, activeUniqueLangCount)
      : `${state.config.audioLangCategories.size} groups • ${activeUniqueLangCount} langs`;
  }

  // 2. Audio Territory Tree Counts & Checkboxes
  const terrLeafCounts = {};
  ALL_AUDIO_TERR_LEAVES.forEach(leaf => {
    const uniqueCountries = new Set(
      TV_NEWS_BROADCASTERS.filter(b => b.territory === leaf).map(b => b.countryCode)
    );
    terrLeafCounts[leaf] = uniqueCountries.size;
    const el = document.getElementById(`terrLeafCount_${leaf}`);
    if (el) el.textContent = `${uniqueCountries.size}`;
  });

  const tAm = document.getElementById('terrParentCountAmerica');
  const tEu = document.getElementById('terrParentCountEurope');
  const tAo = document.getElementById('terrParentCountAsiaOce');
  const tAf = document.getElementById('terrParentCountAfwa');
  if (tAm) tAm.textContent = (terrLeafCounts.am_north || 0) + (terrLeafCounts.am_carib_central || 0) + (terrLeafCounts.am_south || 0);
  if (tEu) tEu.textContent = (terrLeafCounts.eu_west || 0) + (terrLeafCounts.eu_north || 0) + (terrLeafCounts.eu_east_balkan || 0);
  if (tAo) tAo.textContent = (terrLeafCounts.ao_east_asia || 0) + (terrLeafCounts.ao_se_asia || 0) + (terrLeafCounts.ao_south_asia || 0) + (terrLeafCounts.ao_oceania || 0);
  if (tAf) tAf.textContent = (terrLeafCounts.afwa_subsaharan || 0) + (terrLeafCounts.afwa_mena_caucasus || 0);

  // Dynamic Territory Preset Counts
  const iberianBadge = document.getElementById('presetIberianCountBadge');
  const angloBadge = document.getElementById('presetAnglosphereCountBadge');
  if (iberianBadge) {
    iberianBadge.textContent = new Set(
      TV_NEWS_BROADCASTERS.filter(b => b.langCode === 'es' || b.langCode === 'pt').map(b => b.countryCode)
    ).size;
  }
  if (angloBadge) {
    angloBadge.textContent = new Set(
      TV_NEWS_BROADCASTERS.filter(b => ANGLOSPHERE_COUNTRY_CODES.has(b.countryCode) && b.langCode === 'en').map(b => b.countryCode)
    ).size;
  }

  document.querySelectorAll('.audio-terr-leaf').forEach(cb => {
    cb.checked = state.config.audioTerritories.has(cb.value);
  });
  document.querySelectorAll('.audio-terr-parent').forEach(parentCb => {
    const parentKey = parentCb.getAttribute('data-parent');
    const children = Array.from(document.querySelectorAll(`.audio-terr-leaf[data-parent="${parentKey}"]`));
    const checkedCount = children.filter(c => c.checked).length;
    parentCb.checked = checkedCount === children.length && children.length > 0;
    parentCb.indeterminate = checkedCount > 0 && checkedCount < children.length;
  });

  const trapCheckbox = document.getElementById('crossContinentTrapToggle');
  if (trapCheckbox) {
    trapCheckbox.checked = Boolean(state.config.crossContinentTrap);
  }

  // Sync Territory Preset Buttons ('iberian' | 'anglosphere')
  const activePreset = state.config.audioTerritoryPreset;
  document.querySelectorAll('.terr-preset-btn').forEach(btn => {
    const isThisPreset = btn.getAttribute('data-terr-preset') === activePreset;
    if (isThisPreset) {
      btn.classList.add('border-emerald-500', 'bg-emerald-950/35', 'ring-1', 'ring-emerald-500');
      btn.classList.remove('border-slate-800', 'bg-slate-950/75');
    } else {
      btn.classList.remove('border-emerald-500', 'bg-emerald-950/35', 'ring-1', 'ring-emerald-500');
      btn.classList.add('border-slate-800', 'bg-slate-950/75');
    }
  });

  const activeTerrPool = getActiveAudioBroadcastersForCountryMode();
  const activeUniqueCountryCount = new Set(activeTerrPool.map(b => b.countryCode)).size;
  const terrTreeBadge = document.getElementById('audioTerrTreeBadge');
  if (terrTreeBadge) {
    if (activePreset === 'iberian') {
      terrTreeBadge.textContent = `${dict.presetIberianTitle} (${activeUniqueCountryCount})`;
    } else if (activePreset === 'anglosphere') {
      terrTreeBadge.textContent = `${dict.presetAnglosphereTitle} (${activeUniqueCountryCount})`;
    } else {
      terrTreeBadge.textContent = typeof dict.audioTerrBadgeText === 'function'
        ? dict.audioTerrBadgeText(activeUniqueCountryCount, state.config.crossContinentTrap)
        : `${activeUniqueCountryCount} countries${state.config.crossContinentTrap ? ' • Trap' : ''}`;
    }
  }
}

function applyTranslations() {
  const dict = t();
  document.documentElement.lang = state.config.uiLang;

  const textIds = [
    'headerTitle', 'headerSubtitle', 'modeSwitchText', 'modeSwitchAudio',
    'hubHeading', 'hubSubheading',
    'hubTextTitle', 'hubTextBadge', 'hubTextDesc', 'hubTextCta',
    'hubAudioTitle', 'hubAudioBadge', 'hubAudioDesc', 'hubAudioCta',
    'setupHeading', 'setupSubheading', 'audioSetupHeading', 'audioSetupSubheading',
    'labelGameMode', 'modeTenTitle', 'modeTenDesc', 'modeEndless3Title', 'modeEndless3Desc',
    'modeEndless1Title', 'modeEndless1Desc', 'labelLangPool', 'poolStableTitle', 'poolStableDesc',
    'poolExpTitle', 'poolExpDesc', 'poolCustomTitle', 'poolCustomDesc',
    'labelAudioTarget', 'targetLangTitle', 'targetLangDesc', 'targetCountryTitle', 'targetCountryDesc',
    'labelDifficulty', 'diffEasyTitle', 'diffEasyDesc', 'diffMedTitle', 'diffMedDesc',
    'diffHardTitle', 'diffHardDesc', 'startGameBtnText', 'startAudioGameBtnText',
    'hudRoundLabel', 'hudScoreLabel', 'hudStreakLabel', 'hudLivesLabel', 'hudSettingsBtnText',
    'snippetHeaderBadge', 'audioHeaderBadge', 'audioSkipBtnText', 'audioNewClipBtnText',
    'audioSkipBrokenBtnText', 'audioWaveHint', 'scannerStatusTitle', 'scannerStatusSub',
    'keyboardHintText', 'sumScoreLabel', 'sumAccLabel', 'sumRoundsLabel', 'sumStreakLabel',
    'sumHistoryHeading', 'sumChangeSettingsText', 'sumPlayAgainText',
    'videoToggleTitle', 'videoToggleSub', 'nativeToggleTitle', 'nativeToggleSub',
    'modalTitle', 'modalSubtitle', 'catEuroTitle', 'catEuroDesc', 'catAsianTitle', 'catAsianDesc',
    'catAfricanTitle', 'catAfricanDesc', 'catAustroTitle', 'catAustroDesc', 'catIndigTitle', 'catIndigDesc',
    'categoryWarningText',
    'audioLangModalTitle', 'audioLangModalSub',
    'audioLangBranchEuro', 'audioLangLeafRomance', 'audioLangLeafGermanic',
    'audioLangLeafSlavic', 'audioLangLeafEuroOthers',
    'audioLangBranchAsia', 'audioLangLeafAsiaEast', 'audioLangLeafAsiaSe', 'audioLangLeafAsiaSouth',
    'audioLangBranchAfwa', 'audioLangLeafAfwaOther', 'audioLangWarningText',
    'audioTerrModalTitle', 'audioTerrModalSub',
    'trapToggleTitle', 'trapToggleDesc',
    'presetIberianTitle', 'presetIberianSub', 'presetAnglosphereTitle', 'presetAnglosphereSub',
    'audioTerrBranchAmerica', 'audioTerrLeafAmNorth', 'audioTerrLeafAmCarib', 'audioTerrLeafAmSouth',
    'audioTerrBranchEurope', 'audioTerrLeafEuWest', 'audioTerrLeafEuNorth', 'audioTerrLeafEuEast',
    'audioTerrBranchAsiaOce', 'audioTerrLeafAoEast', 'audioTerrLeafAoSe', 'audioTerrLeafAoSouth', 'audioTerrLeafAoOce',
    'audioTerrBranchAfwa', 'audioTerrLeafAfwaSub', 'audioTerrLeafAfwaMena', 'audioTerrWarningText'
  ];

  textIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && typeof dict[id] === 'string') {
      el.textContent = dict[id];
    }
  });

  // Duplicate Audio Setup labels & inline filter pill labels
  const audioModeLabel = document.getElementById('audioLabelGameMode');
  const audioDiffLabel = document.getElementById('audioLabelDifficulty');
  if (audioModeLabel) audioModeLabel.textContent = dict.labelGameMode;
  if (audioDiffLabel) audioDiffLabel.textContent = dict.labelDifficulty;

  const mappedElements = {
    audioModeTenTitle: 'modeTenTitle',
    audioModeTenDesc: 'modeTenDesc',
    audioModeEndless3Title: 'modeEndless3Title',
    audioModeEndless3Desc: 'modeEndless3Desc',
    audioModeEndless1Title: 'modeEndless1Title',
    audioModeEndless1Desc: 'modeEndless1Desc',
    audioDiffEasyTitle: 'diffEasyTitle',
    audioDiffEasyDesc: 'diffEasyDesc',
    audioDiffMedTitle: 'diffMedTitle',
    audioDiffMedDesc: 'diffMedDesc',
    audioDiffHardTitle: 'diffHardTitle',
    audioDiffHardDesc: 'diffHardDesc',
    audioBlurredBadgeText: 'audioBlurredBadge',
    customizeLangFilterText: 'customizeFilterBtn',
    customizeTerrFilterText: 'customizeFilterBtn'
  };
  Object.entries(mappedElements).forEach(([elId, dictKey]) => {
    const el = document.getElementById(elId);
    if (el && typeof dict[dictKey] === 'string') {
      el.textContent = dict[dictKey];
    }
  });

  // Prompt text depends on appMode & audioTarget
  const promptEl = document.getElementById('choosePromptText');
  if (promptEl) {
    if (state.appMode === 'audio') {
      promptEl.textContent = state.config.audioTarget === 'country'
        ? dict.chooseAudioCountryPrompt
        : dict.chooseAudioLangPrompt;
    } else {
      promptEl.textContent = dict.choosePromptText;
    }
  }

  document.getElementById('selectAllCategoriesBtn').textContent = dict.selectAllText;
  document.getElementById('resetCategoriesBtn').textContent = dict.resetText;
  document.getElementById('applyCustomModalBtn').textContent = dict.doneText;

  document.getElementById('selectAllAudioLangBtn').textContent = dict.selectAllText;
  document.getElementById('resetAudioLangBtn').textContent = dict.resetText;
  document.getElementById('applyAudioLangModalBtn').textContent = dict.doneText;
  document.getElementById('selectAllAudioTerrBtn').textContent = dict.selectAllText;
  document.getElementById('resetAudioTerrBtn').textContent = dict.resetText;
  document.getElementById('applyAudioTerrModalBtn').textContent = dict.doneText;

  updateVideoToggleUI();
  document.getElementById('nativeToggleStateText').textContent = state.config.alwaysShowNative
    ? dict.nativeStateOn
    : dict.nativeStateOff;

  document.querySelectorAll('.ui-lang-btn').forEach(btn => {
    const isSelected = btn.getAttribute('data-ui-lang') === state.config.uiLang;
    btn.className = isSelected
      ? 'ui-lang-btn px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold bg-indigo-600 text-white shadow'
      : 'ui-lang-btn px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold text-slate-400 hover:text-white transition';
  });

  updateCategoryCountsAndBadges();
  updatePrefetchBadgesUI();
  updateHudUI();
  updateAudioControlsUI();

  if (state.status === 'playing' || state.status === 'revealed') {
    if (state.currentQuestion) {
      if (state.currentQuestion.isAudio) {
        renderAudioOptionsGrid(state.status === 'revealed');
        if (state.status === 'revealed') updateAudioRevealDetailsUI();
      } else {
        renderTextOptionsGrid(state.status === 'revealed');
        if (state.status === 'revealed') renderTextRevealCard();
      }
    }
  } else if (state.status === 'gameover') {
    renderSummaryScreen();
  }
}

function updateHudUI() {
  document.getElementById('hudRoundValue').textContent =
    state.config.mode === 'ten_tries' ? `${state.round} / ${state.maxRounds}` : `${state.round}`;
  document.getElementById('hudScoreValue').textContent = state.score;
  document.getElementById('hudStreakValue').textContent = `${state.streak} 🔥`;

  const livesBadge = document.getElementById('hudLivesBadge');
  if (state.config.mode === 'ten_tries') {
    livesBadge.classList.add('hidden');
  } else {
    livesBadge.classList.remove('hidden');
    const hearts = '❤️'.repeat(Math.max(0, state.lives)) + '🖤'.repeat(Math.max(0, state.maxLives - state.lives));
    document.getElementById('hudLivesValue').textContent = hearts;
  }
}

function startNewGame() {
  state.textLoadRequestId++;
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.round = 1;
  state.history = [];
  state.status = 'playing';

  if (state.config.mode === 'ten_tries') {
    state.maxRounds = 10;
    state.lives = 0;
    state.maxLives = 0;
    if (state.appMode === 'text' && typeof deduplicatePrefetchQueue === 'function') {
      deduplicatePrefetchQueue();
    }
  } else if (state.config.mode === 'endless_3') {
    state.maxLives = 3;
    state.lives = 3;
  } else {
    state.maxLives = 1;
    state.lives = 1;
  }

  applyTranslations();
  updateHudUI();
  showView('gameScreen');

  if (state.appMode === 'audio') {
    audioEngine.roundRecoveryAttempts = 0;
    loadNextAudioRound();
  } else {
    loadNextTextRound();
  }
}

/**
 * ============================================================================
 * TEXT MODE ROUND FLOW (WIKIPEDIA GAME WITH ASYNC RACE GUARD)
 * ============================================================================
 */
async function loadNextTextRound() {
  const reqId = ++state.textLoadRequestId;
  const fetchEpoch = state.prefetchEpoch;
  state.status = 'playing';
  state.currentQuestion = null;

  document.getElementById('revealCardContainer').classList.add('hidden');
  document.getElementById('snippetContentArea').classList.add('hidden');
  document.getElementById('scannerLoadingState').classList.remove('hidden');
  document.getElementById('optionsGrid').innerHTML = '';
  document.getElementById('charCountBadge').textContent = t().charsUnit(0);

  let roundData = null;
  if (state.prefetchQueue.length > 0) {
    roundData = state.prefetchQueue.shift();
    ensurePrefetchQueue();
  } else {
    roundData = await generateValidArticleRound();
    if (reqId !== state.textLoadRequestId || state.appMode !== 'text' || state.status !== 'playing') {
      // User switched modes or returned to setup while scanning; preserve the fetched round if still valid
      if (roundData && fetchEpoch === state.prefetchEpoch && state.prefetchQueue.length < state.prefetchTargetSize) {
        state.prefetchQueue.push(roundData);
        updatePrefetchBadgesUI();
      }
      return;
    }
    ensurePrefetchQueue();
  }

  if (reqId !== state.textLoadRequestId || state.appMode !== 'text' || state.status !== 'playing') {
    return;
  }

  state.currentQuestion = roundData;
  const displayParagraph = (state.config.difficulty === 'hard' && roundData.hardParagraph)
    ? roundData.hardParagraph
    : roundData.paragraph;
  roundData.activeParagraph = displayParagraph;

  document.getElementById('scannerLoadingState').classList.add('hidden');
  document.getElementById('snippetContentArea').classList.remove('hidden');
  document.getElementById('wikiParagraphText').textContent = displayParagraph;
  document.getElementById('charCountBadge').textContent = t().charsUnit(Array.from(displayParagraph).length);

  renderTextOptionsGrid(false);
  updateHudUI();
}

function renderTextOptionsGrid(isRevealed) {
  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';

  const q = state.currentQuestion;
  if (!q) return;

  const activeOptions = (q.optionsByDifficulty && q.optionsByDifficulty[state.config.difficulty])
    ? q.optionsByDifficulty[state.config.difficulty]
    : q.options;
  q.options = activeOptions;

  const showNative = state.config.alwaysShowNative || isRevealed;

  activeOptions.forEach((optLang, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.disabled = isRevealed;

    const isTarget = optLang.code === q.targetLang.code;
    const isChosen = q.chosenCode === optLang.code;

    let styleClasses = 'option-btn w-full rounded-xl sm:rounded-2xl border text-left flex items-center justify-between gap-2 ';
    if (!isRevealed) {
      styleClasses += 'bg-slate-950/80 border-slate-800 hover:border-indigo-500 hover:bg-indigo-950/30 text-white cursor-pointer';
    } else if (isTarget) {
      styleClasses += 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-950/50';
    } else if (isChosen && !isTarget) {
      styleClasses += 'bg-rose-950/60 border-rose-500 text-rose-100';
    } else {
      styleClasses += 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
    }

    btn.className = styleClasses;
    const translatedName = getLocalizedLanguageName(optLang);

    btn.innerHTML = `
      <div class="min-w-0 flex-1 flex flex-col justify-center">
        <div class="option-lang-name font-bold leading-tight truncate">${escapeHtml(translatedName)}</div>
        <div class="option-native-name leading-tight truncate mt-0.5 ${showNative ? 'text-slate-400' : 'invisible select-none'}">${escapeHtml(optLang.native)}</div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        ${isRevealed && isTarget ? '<i class="fa-solid fa-circle-check text-emerald-400 text-base"></i>' : ''}
        ${isRevealed && isChosen && !isTarget ? '<i class="fa-solid fa-circle-xmark text-rose-400 text-base"></i>' : ''}
        <span class="hidden sm:inline-flex w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 items-center justify-center text-[11px] font-mono text-slate-400">${idx + 1}</span>
      </div>
    `;

    if (!isRevealed) {
      btn.addEventListener('click', () => handleGuessSelection(optLang.code));
    }

    grid.appendChild(btn);
  });
}

function renderTextRevealCard() {
  const dict = t();
  const q = state.currentQuestion;
  const revealCard = document.getElementById('revealCardContainer');
  const statusBanner = document.getElementById('revealStatusBanner');
  const titleEl = document.getElementById('revealArticleTitle');
  const detailsEl = document.getElementById('revealLangDetails');
  const linkEl = document.getElementById('revealWikiLink');
  const linkIcon = document.getElementById('revealExternalLinkIcon');
  const linkText = document.getElementById('revealReadArticleText');
  const nextBtnText = document.getElementById('nextRoundBtnText');

  revealCard.classList.remove('hidden');

  if (q.isCorrect) {
    revealCard.className = 'reveal-card bg-slate-900/95 border border-emerald-500/50 rounded-xl sm:rounded-2xl shadow-2xl';
    statusBanner.className = 'inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300';
    statusBanner.innerHTML = `<i class="fa-solid fa-check"></i> ${escapeHtml(dict.revealCorrect)}`;
  } else {
    revealCard.className = 'reveal-card bg-slate-900/95 border border-rose-500/50 rounded-xl sm:rounded-2xl shadow-2xl';
    statusBanner.className = 'inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300';
    statusBanner.innerHTML = `<i class="fa-solid fa-xmark"></i> ${escapeHtml(dict.revealWrong)}`;
  }

  const translatedLangName = getLocalizedLanguageName(q.targetLang);
  titleEl.textContent = q.articleTitle;
  detailsEl.textContent = dict.revealLangMeta(translatedLangName, q.targetLang.native, q.targetLang.script, q.targetLang.family);
  linkEl.href = q.articleUrl;
  if (linkIcon) linkIcon.className = 'fa-brands fa-wikipedia-w';
  if (linkText) linkText.textContent = dict.revealReadArticleText;

  if (state.config.mode === 'ten_tries' && state.round >= state.maxRounds) {
    nextBtnText.textContent = dict.nextBtnFinalScore;
  } else if (state.config.mode !== 'ten_tries' && state.lives <= 0) {
    nextBtnText.textContent = dict.nextBtnGameOver;
  } else {
    nextBtnText.textContent = dict.nextBtnTryAgain;
  }
}

/**
 * ============================================================================
 * AUDIO MODE ROUND FLOW (TV NEWS BROADCASTS)
 * ============================================================================
 */
function loadNextAudioRound() {
  state.status = 'playing';
  document.getElementById('revealCardContainer').classList.add('hidden');
  document.getElementById('optionsGrid').innerHTML = '';

  const question = generateAudioRoundQuestion();
  state.currentQuestion = question;

  syncVideoViewportVisibility();
  renderAudioOptionsGrid(false);
  updateHudUI();
  loadBroadcasterIntoPlayer(question.broadcaster);
}

function renderAudioOptionsGrid(isRevealed) {
  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';

  const q = state.currentQuestion;
  if (!q || !q.isAudio) return;

  const showNative = state.config.alwaysShowNative || isRevealed;

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.disabled = isRevealed;

    const isTarget = opt.code === q.targetKey;
    const isChosen = q.chosenCode === opt.code;

    let styleClasses = 'option-btn w-full rounded-xl sm:rounded-2xl border text-left flex items-center justify-between gap-2 ';
    if (!isRevealed) {
      styleClasses += 'bg-slate-950/80 border-slate-800 hover:border-sky-500 hover:bg-sky-950/30 text-white cursor-pointer';
    } else if (isTarget) {
      styleClasses += 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-950/50';
    } else if (isChosen && !isTarget) {
      styleClasses += 'bg-rose-950/60 border-rose-500 text-rose-100';
    } else {
      styleClasses += 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
    }

    btn.className = styleClasses;
    btn.innerHTML = `
      <div class="min-w-0 flex-1 flex flex-col justify-center">
        <div class="option-lang-name font-bold leading-tight truncate">${escapeHtml(opt.label)}</div>
        <div class="option-native-name leading-tight truncate mt-0.5 ${showNative ? 'text-slate-400' : 'invisible select-none'}">${escapeHtml(opt.native)}</div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        ${isRevealed && isTarget ? '<i class="fa-solid fa-circle-check text-emerald-400 text-base"></i>' : ''}
        ${isRevealed && isChosen && !isTarget ? '<i class="fa-solid fa-circle-xmark text-rose-400 text-base"></i>' : ''}
        <span class="hidden sm:inline-flex w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 items-center justify-center text-[11px] font-mono text-slate-400">${idx + 1}</span>
      </div>
    `;

    if (!isRevealed) {
      btn.addEventListener('click', () => handleGuessSelection(opt.code));
    }

    grid.appendChild(btn);
  });
}

function updateAudioRevealDetailsUI() {
  const dict = t();
  const q = state.currentQuestion;
  if (!q || !q.isAudio) return;

  const b = q.broadcaster;
  const titleEl = document.getElementById('revealArticleTitle');
  const detailsEl = document.getElementById('revealLangDetails');
  const linkEl = document.getElementById('revealWikiLink');
  const linkIcon = document.getElementById('revealExternalLinkIcon');
  const linkText = document.getElementById('revealReadArticleText');

  const videoTitle = audioEngine.currentVideoTitle || `${b.broadcaster} — Live News Broadcast`;
  const videoUrl = typeof getBroadcasterExternalUrl === 'function'
    ? getBroadcasterExternalUrl(b, audioEngine.currentVideoId)
    : (audioEngine.currentVideoId ? `https://www.youtube.com/watch?v=${encodeURIComponent(audioEngine.currentVideoId)}` : 'https://www.youtube.com');

  const localizedCountry = getLocalizedCountryName(b);
  const localizedLang = getLocalizedLanguageName({ code: b.langCode, name: b.langName });

  titleEl.textContent = videoTitle;
  detailsEl.textContent = dict.revealAudioMeta(b.broadcaster, localizedCountry, b.flag, localizedLang, b.langNative);
  linkEl.href = videoUrl;
  if (linkIcon) linkIcon.className = 'fa-brands fa-youtube text-rose-500';
  if (linkText) linkText.textContent = dict.revealWatchYoutubeText;
}

function renderAudioRevealCard() {
  const dict = t();
  const q = state.currentQuestion;
  const revealCard = document.getElementById('revealCardContainer');
  const statusBanner = document.getElementById('revealStatusBanner');
  const nextBtnText = document.getElementById('nextRoundBtnText');

  // Always reveal the unblurred video after selecting an answer!
  syncVideoViewportVisibility();

  revealCard.classList.remove('hidden');

  if (q.isCorrect) {
    revealCard.className = 'reveal-card bg-slate-900/95 border border-emerald-500/50 rounded-xl sm:rounded-2xl shadow-2xl';
    statusBanner.className = 'inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300';
    statusBanner.innerHTML = `<i class="fa-solid fa-check"></i> ${escapeHtml(dict.revealCorrect)}`;
  } else {
    revealCard.className = 'reveal-card bg-slate-900/95 border border-rose-500/50 rounded-xl sm:rounded-2xl shadow-2xl';
    statusBanner.className = 'inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300';
    statusBanner.innerHTML = `<i class="fa-solid fa-xmark"></i> ${escapeHtml(dict.revealWrong)}`;
  }

  updateAudioRevealDetailsUI();

  if (state.config.mode === 'ten_tries' && state.round >= state.maxRounds) {
    nextBtnText.textContent = dict.nextBtnFinalScore;
  } else if (state.config.mode !== 'ten_tries' && state.lives <= 0) {
    nextBtnText.textContent = dict.nextBtnGameOver;
  } else {
    nextBtnText.textContent = dict.nextBtnTryAgain;
  }
}

/**
 * ============================================================================
 * SHARED ANSWER SELECTION, NEXT ROUND & SUMMARY SCREEN
 * ============================================================================
 */
function handleGuessSelection(selectedCode) {
  if (state.status !== 'playing' || !state.currentQuestion) return;

  state.status = 'revealed';
  const q = state.currentQuestion;
  q.chosenCode = selectedCode;

  if (q.isAudio) {
    const isCorrect = selectedCode === q.targetKey;
    q.isCorrect = isCorrect;

    const chosenOpt = q.options.find(o => o.code === selectedCode) || q.options[0];
    const targetOpt = q.options.find(o => o.code === q.targetKey) || q.options[0];

    if (isCorrect) {
      state.score++;
      state.streak++;
      if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    } else {
      state.streak = 0;
      if (state.config.mode !== 'ten_tries') {
        state.lives = Math.max(0, state.lives - 1);
      }
    }

    const videoUrl = typeof getBroadcasterExternalUrl === 'function'
      ? getBroadcasterExternalUrl(q.broadcaster, audioEngine.currentVideoId)
      : (audioEngine.currentVideoId ? `https://www.youtube.com/watch?v=${encodeURIComponent(audioEngine.currentVideoId)}` : 'https://www.youtube.com');

    state.history.push({
      round: state.round,
      isAudio: true,
      targetKey: q.targetKey,
      spokenLangCode: q.spokenLangCode,
      targetDisplayName: targetOpt.label,
      chosenDisplayName: chosenOpt.label,
      isCorrect,
      articleTitle: audioEngine.currentVideoTitle || q.broadcaster.broadcaster,
      articleUrl: videoUrl
    });

    updateHudUI();
    renderAudioOptionsGrid(true);
    renderAudioRevealCard();
  } else {
    const isCorrect = selectedCode === q.targetLang.code;
    q.isCorrect = isCorrect;

    const chosenLangObj = WIKI_LANGUAGES.find(l => l.code === selectedCode) || q.targetLang;
    if (isCorrect) {
      state.score++;
      state.streak++;
      if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    } else {
      state.streak = 0;
      if (state.config.mode !== 'ten_tries') {
        state.lives = Math.max(0, state.lives - 1);
      }
    }

    state.history.push({
      round: state.round,
      isAudio: false,
      targetLang: q.targetLang,
      chosenLang: chosenLangObj,
      isCorrect,
      articleTitle: q.articleTitle,
      articleUrl: q.articleUrl
    });

    updateHudUI();
    renderTextOptionsGrid(true);
    renderTextRevealCard();
  }
}

function handleNextStep() {
  if (state.status !== 'revealed') return;

  if (state.config.mode === 'ten_tries' && state.round >= state.maxRounds) {
    stopAudioPlayback();
    state.status = 'gameover';
    renderSummaryScreen();
    return;
  }

  if (state.config.mode !== 'ten_tries' && state.lives <= 0) {
    stopAudioPlayback();
    state.status = 'gameover';
    renderSummaryScreen();
    return;
  }

  state.round++;
  if (state.appMode === 'audio') {
    audioEngine.roundRecoveryAttempts = 0;
    loadNextAudioRound();
  } else {
    loadNextTextRound();
  }
}

function renderSummaryScreen() {
  const dict = t();
  showView('summaryScreen');

  const totalPlayed = state.history.length;
  const accuracy = totalPlayed > 0 ? Math.round((state.score / totalPlayed) * 100) : 0;

  const iconBox = document.getElementById('summaryIconBox');
  const modeBadge = document.getElementById('summaryModeBadge');
  const titleEl = document.getElementById('summaryTitle');
  const subEl = document.getElementById('summarySubtitle');

  if (state.config.mode === 'ten_tries') {
    iconBox.className = 'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300';
    iconBox.innerHTML = '<i class="fa-solid fa-trophy"></i>';
    modeBadge.textContent = dict.sumTenTriesBadge;
    titleEl.textContent = dict.sumTenTriesTitle(state.score, state.maxRounds);
  } else if (state.config.mode === 'endless_3') {
    iconBox.className = 'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg bg-rose-500/20 border border-rose-500/40 text-rose-300';
    iconBox.innerHTML = '<i class="fa-solid fa-heart-crack"></i>';
    modeBadge.textContent = dict.sumEndless3Badge;
    titleEl.textContent = dict.sumEndless3Title(state.score);
  } else {
    iconBox.className = 'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl shadow-lg bg-amber-500/20 border border-amber-500/40 text-amber-300';
    iconBox.innerHTML = '<i class="fa-solid fa-skull"></i>';
    modeBadge.textContent = dict.sumEndless1Badge;
    titleEl.textContent = dict.sumEndless1Title(state.score);
  }

  subEl.textContent = `${dict.sumAccLabel}: ${accuracy}% • ${dict.sumStreakLabel}: ${state.bestStreak}`;
  document.getElementById('sumFinalScore').textContent = state.score;
  document.getElementById('sumAccuracy').textContent = `${accuracy}%`;
  document.getElementById('sumRounds').textContent = totalPlayed;
  document.getElementById('sumBestStreak').textContent = `${state.bestStreak} 🔥`;

  const listEl = document.getElementById('summaryHistoryList');
  listEl.innerHTML = '';

  state.history.forEach(item => {
    const row = document.createElement('div');
    row.className = 'p-3 rounded-2xl bg-slate-950/75 border border-slate-800 flex items-center justify-between gap-3';

    const targetDisplay = item.isAudio
      ? item.targetDisplayName
      : `${getLocalizedLanguageName(item.targetLang)} (${item.targetLang.native})`;
    const chosenDisplay = item.isAudio
      ? item.chosenDisplayName
      : getLocalizedLanguageName(item.chosenLang);

    row.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <span class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${item.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
          <i class="fa-solid ${item.isCorrect ? 'fa-check' : 'fa-xmark'}"></i>
        </span>
        <div class="min-w-0">
          <div class="text-xs font-bold text-white truncate">
            ${dict.historyRound(item.round)}: <span class="text-indigo-300">${escapeHtml(targetDisplay)}</span>
          </div>
          <div class="text-[11px] text-slate-400 truncate">
            ${item.isCorrect ? escapeHtml(dict.historyGuessedCorrectly) : `${escapeHtml(dict.historyYourGuess)} <span class="text-rose-300">${escapeHtml(chosenDisplay)}</span>`} • "${escapeHtml(item.articleTitle)}"
          </div>
        </div>
      </div>
      <a href="${escapeHtml(item.articleUrl)}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
    `;
    listEl.appendChild(row);
  });
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

function openAudioLangTreeModal() {
  const modal = document.getElementById('audioLangTreeModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  updateAudioTreeCountsAndBadges();
}

function closeAudioLangTreeModal() {
  const modal = document.getElementById('audioLangTreeModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function openAudioTerritoryTreeModal() {
  const modal = document.getElementById('audioTerritoryTreeModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  updateAudioTreeCountsAndBadges();
}

function closeAudioTerritoryTreeModal() {
  const modal = document.getElementById('audioTerritoryTreeModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * ============================================================================
 * EVENT LISTENERS & INITIALIZATION
 * ============================================================================
 */
document.querySelectorAll('.ui-lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.config.uiLang = btn.getAttribute('data-ui-lang');
    applyTranslations();
  });
});

// Hub & Header Mode Switchers
document.getElementById('brandHomeBtn').addEventListener('click', () => {
  state.textLoadRequestId++;
  stopAudioPlayback();
  state.status = 'hub';
  showView('modeHubScreen');
});
document.getElementById('chooseTextModeCard').addEventListener('click', () => switchAppMode('text'));
document.getElementById('chooseAudioModeCard').addEventListener('click', () => switchAppMode('audio'));
document.getElementById('headerModeTextBtn').addEventListener('click', () => switchAppMode('text'));
document.getElementById('headerModeAudioBtn').addEventListener('click', () => switchAppMode('audio'));

// Config Cards (shared across Text Setup and Audio Setup)
function activateConfigCard(card) {
  const group = card.getAttribute('data-config-group');
  const val = card.getAttribute('data-config-value');
  if (!group || !val) return;

  const prevVal = state.config[group];
  state.config[group] = val;

  if (group === 'mode') {
    if (val === 'ten_tries' && prevVal !== 'ten_tries' && typeof deduplicatePrefetchQueue === 'function') {
      deduplicatePrefetchQueue();
    }
  } else if (group === 'pool') {
    if (prevVal !== val) {
      state.prefetchEpoch++;
      state.prefetchQueue = [];
      ensurePrefetchQueue();
    }
    if (val === 'custom') {
      openCustomModal();
    }
  }
  // Note: Clicking Audio Target cards ('language' / 'country') now selects the target
  // without forcing the filter modal open; dedicated Filter buttons open the tree modals.
  updateConfigCardsUI();
}

document.querySelectorAll('.config-card').forEach(card => {
  card.addEventListener('click', () => activateConfigCard(card));
  card.addEventListener('keydown', (e) => {
    if (e.target !== card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateConfigCard(card);
    }
  });
});

// Dedicated Inline Filter Buttons on Audio Target Cards
const openAudioLangFilterBtn = document.getElementById('openAudioLangFilterBtn');
if (openAudioLangFilterBtn) {
  openAudioLangFilterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    state.config.audioTarget = 'language';
    updateConfigCardsUI();
    openAudioLangTreeModal();
  });
}

const openAudioTerrFilterBtn = document.getElementById('openAudioTerrFilterBtn');
if (openAudioTerrFilterBtn) {
  openAudioTerrFilterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    state.config.audioTarget = 'country';
    updateConfigCardsUI();
    openAudioTerritoryTreeModal();
  });
}

// Audio Language Tree Modal Listeners
document.getElementById('closeAudioLangModalBtn').addEventListener('click', closeAudioLangTreeModal);
document.getElementById('applyAudioLangModalBtn').addEventListener('click', closeAudioLangTreeModal);
document.getElementById('audioLangTreeModal').addEventListener('click', (e) => {
  if (e.target.id === 'audioLangTreeModal') closeAudioLangTreeModal();
});

document.querySelectorAll('.audio-tree-parent').forEach(parentCb => {
  parentCb.addEventListener('change', () => {
    const parentKey = parentCb.getAttribute('data-parent');
    const children = Array.from(document.querySelectorAll(`.audio-lang-leaf[data-parent="${parentKey}"]`));
    const warn = document.getElementById('audioLangWarningMsg');

    if (parentCb.checked) {
      children.forEach(c => state.config.audioLangCategories.add(c.value));
      warn.classList.add('hidden');
    } else {
      const remaining = Array.from(state.config.audioLangCategories).filter(
        val => !children.some(c => c.value === val)
      );
      if (remaining.length === 0) {
        parentCb.checked = true;
        warn.classList.remove('hidden');
        return;
      }
      children.forEach(c => state.config.audioLangCategories.delete(c.value));
      warn.classList.add('hidden');
    }
    updateAudioTreeCountsAndBadges();
  });
});

document.querySelectorAll('.audio-lang-leaf').forEach(leafCb => {
  leafCb.addEventListener('change', () => {
    const warn = document.getElementById('audioLangWarningMsg');
    if (leafCb.checked) {
      state.config.audioLangCategories.add(leafCb.value);
      warn.classList.add('hidden');
    } else {
      if (state.config.audioLangCategories.size <= 1) {
        leafCb.checked = true;
        warn.classList.remove('hidden');
        return;
      }
      state.config.audioLangCategories.delete(leafCb.value);
      warn.classList.add('hidden');
    }
    updateAudioTreeCountsAndBadges();
  });
});

document.getElementById('selectAllAudioLangBtn').addEventListener('click', () => {
  ALL_AUDIO_LANG_LEAVES.forEach(v => state.config.audioLangCategories.add(v));
  document.getElementById('audioLangWarningMsg').classList.add('hidden');
  updateAudioTreeCountsAndBadges();
});

document.getElementById('resetAudioLangBtn').addEventListener('click', () => {
  state.config.audioLangCategories = new Set(DEFAULT_AUDIO_LANG_LEAVES);
  document.getElementById('audioLangWarningMsg').classList.add('hidden');
  updateAudioTreeCountsAndBadges();
});

// Audio Territory Tree Modal Listeners
document.getElementById('closeAudioTerrModalBtn').addEventListener('click', closeAudioTerritoryTreeModal);
document.getElementById('applyAudioTerrModalBtn').addEventListener('click', closeAudioTerritoryTreeModal);
document.getElementById('audioTerritoryTreeModal').addEventListener('click', (e) => {
  if (e.target.id === 'audioTerritoryTreeModal') closeAudioTerritoryTreeModal();
});

document.getElementById('crossContinentTrapToggle').addEventListener('change', (e) => {
  // If a territory preset was active (leaving audioTerritories empty), restore default territories
  // so toggling the Cross-Continent Trap never leaves zero territories selected.
  if (state.config.audioTerritoryPreset !== null) {
    state.config.audioTerritoryPreset = null;
    if (state.config.audioTerritories.size === 0) {
      state.config.audioTerritories = new Set(DEFAULT_AUDIO_TERR_LEAVES);
    }
  }
  state.config.crossContinentTrap = e.target.checked;
  updateAudioTreeCountsAndBadges();
});

document.querySelectorAll('.terr-preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const presetKey = btn.getAttribute('data-terr-preset');
    const warn = document.getElementById('audioTerrWarningMsg');
    if (warn) warn.classList.add('hidden');

    if (state.config.audioTerritoryPreset === presetKey) {
      // Clicking an active preset toggles it off and restores default territories
      state.config.audioTerritoryPreset = null;
      state.config.audioTerritories = new Set(DEFAULT_AUDIO_TERR_LEAVES);
    } else {
      state.config.audioTerritoryPreset = presetKey;
      // Uncheck all continental tree checkboxes while the preset overrides the pool
      state.config.audioTerritories = new Set();
    }
    updateAudioTreeCountsAndBadges();
  });
});

document.querySelectorAll('.audio-terr-parent').forEach(parentCb => {
  parentCb.addEventListener('change', () => {
    const parentKey = parentCb.getAttribute('data-parent');
    const children = Array.from(document.querySelectorAll(`.audio-terr-leaf[data-parent="${parentKey}"]`));
    const warn = document.getElementById('audioTerrWarningMsg');

    // Manually interacting with the tree clears any active preset highlight
    state.config.audioTerritoryPreset = null;

    if (parentCb.checked) {
      children.forEach(c => state.config.audioTerritories.add(c.value));
      warn.classList.add('hidden');
    } else {
      const remaining = Array.from(state.config.audioTerritories).filter(
        val => !children.some(c => c.value === val)
      );
      if (remaining.length === 0) {
        parentCb.checked = true;
        warn.classList.remove('hidden');
        return;
      }
      children.forEach(c => state.config.audioTerritories.delete(c.value));
      warn.classList.add('hidden');
    }
    updateAudioTreeCountsAndBadges();
  });
});

document.querySelectorAll('.audio-terr-leaf').forEach(leafCb => {
  leafCb.addEventListener('change', () => {
    const warn = document.getElementById('audioTerrWarningMsg');

    // Manually interacting with the tree clears any active preset highlight
    state.config.audioTerritoryPreset = null;

    if (leafCb.checked) {
      state.config.audioTerritories.add(leafCb.value);
      warn.classList.add('hidden');
    } else {
      if (state.config.audioTerritories.size <= 1) {
        leafCb.checked = true;
        warn.classList.remove('hidden');
        return;
      }
      state.config.audioTerritories.delete(leafCb.value);
      warn.classList.add('hidden');
    }
    updateAudioTreeCountsAndBadges();
  });
});

document.getElementById('selectAllAudioTerrBtn').addEventListener('click', () => {
  state.config.audioTerritoryPreset = null;
  ALL_AUDIO_TERR_LEAVES.forEach(v => state.config.audioTerritories.add(v));
  document.getElementById('audioTerrWarningMsg').classList.add('hidden');
  updateAudioTreeCountsAndBadges();
});

document.getElementById('resetAudioTerrBtn').addEventListener('click', () => {
  state.config.audioTerritoryPreset = null;
  state.config.audioTerritories = new Set(DEFAULT_AUDIO_TERR_LEAVES);
  state.config.crossContinentTrap = true;
  document.getElementById('audioTerrWarningMsg').classList.add('hidden');
  updateAudioTreeCountsAndBadges();
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
      warn.classList.add('hidden');
    }
    updateCategoryCountsAndBadges();
    state.prefetchEpoch++;
    state.prefetchQueue = [];
    ensurePrefetchQueue();
  });
});

document.getElementById('selectAllCategoriesBtn').addEventListener('click', () => {
  ALL_CATEGORIES.forEach(cat => state.config.customCategories.add(cat));
  document.getElementById('categoryWarningMsg').classList.add('hidden');
  updateCategoryCountsAndBadges();
  state.prefetchEpoch++;
  state.prefetchQueue = [];
  ensurePrefetchQueue();
});

document.getElementById('resetCategoriesBtn').addEventListener('click', () => {
  state.config.customCategories = new Set(['european', 'asian']);
  document.getElementById('categoryWarningMsg').classList.add('hidden');
  updateCategoryCountsAndBadges();
  state.prefetchEpoch++;
  state.prefetchQueue = [];
  ensurePrefetchQueue();
});

// Start Game Buttons (Text & Audio)
document.getElementById('startGameBtn').addEventListener('click', startNewGame);
document.getElementById('startAudioGameBtn').addEventListener('click', startNewGame);
document.getElementById('nextRoundBtn').addEventListener('click', handleNextStep);

// Pause embedded broadcast if user clicks "Open on YouTube" from Reveal Card
document.getElementById('revealWikiLink').addEventListener('click', () => {
  if (state.appMode === 'audio' && typeof pauseAudioPlayback === 'function') {
    pauseAudioPlayback();
  }
});

// Audio Player Bar Controls
document.getElementById('audioPlayPauseBtn').addEventListener('click', toggleAudioPlayPause);
document.getElementById('audioSkip15Btn').addEventListener('click', skipAudioForward15s);
document.getElementById('audioNewClipBtn').addEventListener('click', switchSameBroadcasterClip);
document.getElementById('audioMuteBtn').addEventListener('click', toggleAudioMute);

const audioSkipBrokenBtn = document.getElementById('audioSkipBrokenBtn');
if (audioSkipBrokenBtn) {
  audioSkipBrokenBtn.addEventListener('click', skipUnavailableBroadcast);
}

/**
 * Syncs the bottom Video Display toggle label and track color across all 3 states:
 * 'off' (Audio Only), 'blurred' (Blurred Video), and 'clear' (Remove Blur 🔓).
 */
function updateVideoToggleUI() {
  const dict = t();
  const stateTextEl = document.getElementById('videoToggleStateText');
  const checkboxEl = document.getElementById('showBlurredVideoToggle');
  const trackEl = document.getElementById('videoToggleSwitchTrack');
  if (!stateTextEl || !checkboxEl) return;

  const mode = state.config.videoDisplayMode || (state.config.showBlurredVideo ? 'blurred' : 'off');
  if (mode === 'clear') {
    checkboxEl.checked = true;
    stateTextEl.textContent = dict.videoStateClear || 'Remove Blur 🔓';
    stateTextEl.className = 'text-xs font-bold text-amber-400';
    if (trackEl) trackEl.classList.add('!bg-amber-500');
  } else if (mode === 'blurred') {
    checkboxEl.checked = true;
    stateTextEl.textContent = dict.videoStateOn || 'Blurred Video';
    stateTextEl.className = 'text-xs font-semibold text-sky-400';
    if (trackEl) trackEl.classList.remove('!bg-amber-500');
  } else {
    checkboxEl.checked = false;
    stateTextEl.textContent = dict.videoStateOff || 'Audio Only';
    stateTextEl.className = 'text-xs font-semibold text-slate-400';
    if (trackEl) trackEl.classList.remove('!bg-amber-500');
  }
}

// Video Display Toggle (with Secret 6-Fast-Clicks "Remove Blur" 3rd Option)
document.getElementById('showBlurredVideoToggle').addEventListener('change', () => {
  const now = Date.now();
  state.videoToggleClickTimestamps.push(now);
  // Keep clicks within the last 2.2 seconds
  state.videoToggleClickTimestamps = state.videoToggleClickTimestamps.filter(ts => now - ts <= 2200);

  if (state.videoToggleClickTimestamps.length >= 6) {
    state.videoToggleClickTimestamps = [];
    state.config.unblurredSecretUnlocked = true;
    state.config.videoDisplayMode = 'clear';
    state.config.showBlurredVideo = true;
  } else if (state.config.unblurredSecretUnlocked) {
    // Cycle through all 3 modes once unlocked: off -> blurred -> clear -> off
    if (state.config.videoDisplayMode === 'off') {
      state.config.videoDisplayMode = 'blurred';
      state.config.showBlurredVideo = true;
    } else if (state.config.videoDisplayMode === 'blurred') {
      state.config.videoDisplayMode = 'clear';
      state.config.showBlurredVideo = true;
    } else {
      state.config.videoDisplayMode = 'off';
      state.config.showBlurredVideo = false;
    }
  } else {
    // Standard 2-state toggle: off <-> blurred
    const nextIsBlurred = state.config.videoDisplayMode === 'off';
    state.config.videoDisplayMode = nextIsBlurred ? 'blurred' : 'off';
    state.config.showBlurredVideo = nextIsBlurred;
  }

  updateVideoToggleUI();
  syncVideoViewportVisibility();
});

// Return to Setup Buttons
document.getElementById('openSettingsBtn').addEventListener('click', () => {
  state.textLoadRequestId++;
  stopAudioPlayback();
  state.status = 'setup';
  showView(state.appMode === 'audio' ? 'audioSetupScreen' : 'setupScreen');
});

document.getElementById('summaryChangeSettingsBtn').addEventListener('click', () => {
  state.textLoadRequestId++;
  stopAudioPlayback();
  state.status = 'setup';
  showView(state.appMode === 'audio' ? 'audioSetupScreen' : 'setupScreen');
});

document.getElementById('summaryPlayAgainBtn').addEventListener('click', startNewGame);

// Native Name Toggle
document.getElementById('alwaysShowNativeToggle').addEventListener('change', (e) => {
  state.config.alwaysShowNative = e.target.checked;
  document.getElementById('nativeToggleStateText').textContent = state.config.alwaysShowNative
    ? t().nativeStateOn
    : t().nativeStateOff;

  if ((state.status === 'playing' || state.status === 'revealed') && state.currentQuestion) {
    if (state.currentQuestion.isAudio) {
      renderAudioOptionsGrid(state.status === 'revealed');
    } else {
      renderTextOptionsGrid(state.status === 'revealed');
    }
  }
});

// Keyboard Shortcuts (1-4 to pick, Enter/Space for Next)
document.addEventListener('keydown', (e) => {
  const langModal = document.getElementById('customCategoriesModal');
  const audioLangModal = document.getElementById('audioLangTreeModal');
  const audioTerrModal = document.getElementById('audioTerritoryTreeModal');
  if (
    !langModal.classList.contains('hidden') ||
    (audioLangModal && !audioLangModal.classList.contains('hidden')) ||
    (audioTerrModal && !audioTerrModal.classList.contains('hidden'))
  ) {
    if (e.key === 'Escape') {
      closeCustomModal();
      closeAudioLangTreeModal();
      closeAudioTerritoryTreeModal();
    }
    return;
  }

  if (state.status === 'playing' && state.currentQuestion) {
    const keyNum = parseInt(e.key, 10);
    if (keyNum >= 1 && keyNum <= 4 && state.currentQuestion.options[keyNum - 1]) {
      handleGuessSelection(state.currentQuestion.options[keyNum - 1].code);
    }
  } else if (state.status === 'revealed') {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNextStep();
    }
  }
});

// Boot the App on the Initial Mode Chooser Hub ("Text" vs "Audio")
applyTranslations();
updateConfigCardsUI();
showView('modeHubScreen');
ensurePrefetchQueue();
