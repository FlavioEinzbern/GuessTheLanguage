/**
 * ============================================================================
 * YOUTUBE CURATED AUDIO/VIDEO ENGINE (With Multi-Segment & Autoplay-Safe Guard)
 * ============================================================================
 * - Uses only human-approved broadcast clips from `TV_NEWS_BROADCASTERS`
 *   (no fragile third-party CORS/RSS proxy dependency).
 * - Enforces exact timestamp ranges (`segments: [[start, end], ...]`) and
 *   intro-skip floors (`minStart`).
 * - Autoplay-safe watchdog: detects mobile/browser autoplay blocks instead of
 *   triggering reload loops, and handles dead broadcasters cleanly in both
 *   Language Mode and Country Mode.
 * - Supports 3 Video Display Modes while guessing:
 *   1. 'off'     -> Audio Only (radio waveform over live ≥200px hidden player)
 *   2. 'blurred' -> Blurred TV Video
 *   3. 'clear'   -> Secret Unblurred TV Video (unlocked by clicking toggle 6 times fast)
 */

const audioEngine = {
  ytReady: false,
  player: null,
  isPlaying: false,
  isMuted: false,
  autoplayBlocked: false,
  userHasInteracted: false,
  broadcastUnavailable: false,
  currentBroadcaster: null,
  currentClip: null,
  currentVideoId: null,
  currentVideoTitle: '',
  currentStartSeconds: 20,
  currentClipIndex: 0,
  activeSegmentIndex: 0,
  failedVideoIds: new Set(),
  failedBroadcasterIds: new Set(),
  fallbackAttemptCount: 0,
  roundRecoveryAttempts: 0,
  loadRequestId: 0,
  watchdogTimer: null,
  segmentGuardTimer: null
};

/**
 * Computes a valid start timestamp for a clip, honoring:
 * - `clip.segments` (array of `[startSec, endSec]` windows, e.g. MO-2, MO-3, FI-1, IS-1)
 * - `clip.minStart` and `clip.maxStart` (including >60s offsets like CA-FR-1 & MN-1)
 */
function computeAnchorStartSeconds(clip) {
  if (clip && Array.isArray(clip.segments) && clip.segments.length > 0) {
    const segIdx = Math.floor(Math.random() * clip.segments.length);
    audioEngine.activeSegmentIndex = segIdx;
    const [segMin, segMax] = clip.segments[segIdx];
    const safeMax = Math.max(segMin, Math.min(segMin + 65, segMax - 12));
    return Math.floor(Math.random() * (safeMax - segMin + 1)) + segMin;
  }

  audioEngine.activeSegmentIndex = 0;
  const minS = Math.max(1, Number(clip && clip.minStart) || 10);
  const rawMax = Number(clip && clip.maxStart) || (minS + 40);
  const maxS = Math.max(minS + 4, rawMax);
  return Math.floor(Math.random() * (maxS - minS + 1)) + minS;
}

/**
 * Starts a 1-second monitor that keeps playback inside approved segments
 * (for videos with `segments` like MO-2/MO-3/FI-1/IS-1 or `minStart` like CA-FR-1/MN-1..3).
 */
function startSegmentBoundaryGuard() {
  clearInterval(audioEngine.segmentGuardTimer);
  audioEngine.segmentGuardTimer = setInterval(() => {
    if (!audioEngine.isPlaying || !audioEngine.player || !audioEngine.currentClip) return;
    if (typeof audioEngine.player.getCurrentTime !== 'function') return;

    const cur = audioEngine.player.getCurrentTime();
    if (typeof cur !== 'number' || isNaN(cur)) return;

    const clip = audioEngine.currentClip;

    // 1. Strict multi-segment enforcement (e.g. MO-2, MO-3, FI-1, IS-1)
    if (Array.isArray(clip.segments) && clip.segments.length > 0) {
      const inAnySegment = clip.segments.some(([sMin, sMax]) => cur >= sMin - 1 && cur <= sMax);
      if (!inAnySegment) {
        const nextSegIdx = (audioEngine.activeSegmentIndex + 1) % clip.segments.length;
        audioEngine.activeSegmentIndex = nextSegIdx;
        const [nextStart] = clip.segments[nextSegIdx];
        audioEngine.currentStartSeconds = nextStart;
        audioEngine.player.seekTo(nextStart, true);
      }
      return;
    }

    // 2. Minimum start enforcement (e.g. CA-FR-1 > 209s, MN-1 > 81s, MN-2 > 44s, MN-3 > 35s)
    if (typeof clip.minStart === 'number' && clip.minStart > 15 && cur < clip.minStart - 2) {
      audioEngine.player.seekTo(clip.minStart, true);
    }
  }, 1000);
}

/**
 * Schedules an autoplay-safe watchdog:
 * - If the browser blocked unmuted autoplay (PAUSED/CUED/UNSTARTED before user interaction),
 *   prompts the user to tap Play instead of triggering a reload loop.
 * - Only marks a clip broken and falls back if it stays stuck in BUFFERING or fails to start
 *   after the user has explicitly initiated playback.
 */
function schedulePlaybackWatchdog(reqId) {
  clearTimeout(audioEngine.watchdogTimer);
  audioEngine.watchdogTimer = setTimeout(() => {
    if (
      reqId !== audioEngine.loadRequestId ||
      audioEngine.isPlaying ||
      state.appMode !== 'audio' ||
      state.status !== 'playing'
    ) {
      return;
    }

    let pState = null;
    if (audioEngine.player && typeof audioEngine.player.getPlayerState === 'function') {
      try {
        pState = audioEngine.player.getPlayerState();
      } catch (e) {}
    }

    const YTState = window.YT && window.YT.PlayerState ? window.YT.PlayerState : null;
    if (YTState && pState === YTState.PLAYING) {
      return;
    }

    const isStuckBuffering = YTState && pState === YTState.BUFFERING;
    const isUnstartedAfterGesture =
      YTState && pState === YTState.UNSTARTED && audioEngine.userHasInteracted;

    if (isStuckBuffering || isUnstartedAfterGesture) {
      if (audioEngine.currentVideoId) {
        audioEngine.failedVideoIds.add(audioEngine.currentVideoId);
      }
      triggerBroadcasterFallback();
    } else {
      // Likely browser/mobile autoplay policy pause; wait cleanly for user tap
      audioEngine.autoplayBlocked = true;
      updateAudioControlsUI(false);
    }
  }, 6000);
}

/**
 * Injects the YouTube IFrame API script once.
 */
function initYouTubeApi() {
  if (window.YT && window.YT.Player) {
    audioEngine.ytReady = true;
    createYouTubePlayerInstance();
    return;
  }
  if (document.getElementById('ytIframeApiScript')) return;

  const tag = document.createElement('script');
  tag.id = 'ytIframeApiScript';
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

window.onYouTubeIframeAPIReady = function () {
  audioEngine.ytReady = true;
  createYouTubePlayerInstance();
};

function createYouTubePlayerInstance() {
  if (audioEngine.player || !audioEngine.ytReady) return;
  const container = document.getElementById('ytPlayerElement');
  if (!container) return;

  const playerVars = {
    autoplay: 1,
    controls: 0,
    disablekb: 1,
    fs: 0,
    iv_load_policy: 3,
    modestbranding: 1,
    rel: 0,
    playsinline: 1
  };

  if (window.location && /^https?:\/\//i.test(window.location.origin)) {
    playerVars.origin = window.location.origin;
  }

  audioEngine.player = new YT.Player('ytPlayerElement', {
    width: '100%',
    height: '100%',
    host: 'https://www.youtube.com',
    playerVars,
    events: {
      onReady: onYtPlayerReady,
      onStateChange: onYtPlayerStateChange,
      onError: onYtPlayerError
    }
  });
}

function onYtPlayerReady() {
  if (audioEngine.currentBroadcaster && state.appMode === 'audio' && state.status === 'playing') {
    loadBroadcasterIntoPlayer(audioEngine.currentBroadcaster);
  }
}

function onYtPlayerStateChange(event) {
  if (!window.YT) return;
  if (event.data === YT.PlayerState.PLAYING) {
    clearTimeout(audioEngine.watchdogTimer);
    audioEngine.isPlaying = true;
    audioEngine.autoplayBlocked = false;
    audioEngine.broadcastUnavailable = false;
    audioEngine.userHasInteracted = true;
    audioEngine.fallbackAttemptCount = 0;
    audioEngine.roundRecoveryAttempts = 0;
    startSegmentBoundaryGuard();

    try {
      const data = audioEngine.player.getVideoData();
      if (data && data.video_id) {
        if (!audioEngine.currentVideoId || data.video_id === audioEngine.currentVideoId) {
          audioEngine.currentVideoId = data.video_id;
          if (data.title) {
            audioEngine.currentVideoTitle = data.title;
          }
        }
      }
    } catch (e) {}

    updateAudioControlsUI(false);
    if (state.status === 'revealed') {
      updateAudioRevealDetailsUI();
    }
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    audioEngine.isPlaying = false;
    updateAudioControlsUI(false);
  } else if (event.data === YT.PlayerState.BUFFERING) {
    audioEngine.autoplayBlocked = false;
    updateAudioControlsUI(true);
  }
}

function onYtPlayerError() {
  clearTimeout(audioEngine.watchdogTimer);
  if (audioEngine.currentVideoId) {
    audioEngine.failedVideoIds.add(audioEngine.currentVideoId);
  }
  triggerBroadcasterFallback();
}

/**
 * Returns the verified clips for a broadcaster, excluding any video IDs that failed.
 * Returns an empty array if every clip for this broadcaster has failed (preventing loops).
 */
function getAvailableClipsForBroadcaster(broadcaster) {
  if (!broadcaster || !Array.isArray(broadcaster.videos)) return [];
  return broadcaster.videos.filter(v => v && v.id && !audioEngine.failedVideoIds.has(v.id));
}

/**
 * Loads a random curated TV news broadcast clip from the chosen broadcaster into YouTube.
 */
function loadBroadcasterIntoPlayer(broadcaster, keepAttemptCount = false) {
  const reqId = ++audioEngine.loadRequestId;
  clearTimeout(audioEngine.watchdogTimer);
  clearInterval(audioEngine.segmentGuardTimer);

  if (audioEngine.player && typeof audioEngine.player.stopVideo === 'function') {
    try {
      audioEngine.player.stopVideo();
    } catch (e) {}
  }

  audioEngine.currentBroadcaster = broadcaster;
  audioEngine.currentClip = null;
  audioEngine.currentVideoId = null;
  audioEngine.currentVideoTitle = '';
  audioEngine.isPlaying = false;
  audioEngine.autoplayBlocked = false;
  audioEngine.broadcastUnavailable = false;
  if (!keepAttemptCount) {
    audioEngine.fallbackAttemptCount = 0;
  }

  updateAudioControlsUI(true);
  syncVideoViewportVisibility();

  const clips = getAvailableClipsForBroadcaster(broadcaster);
  if (clips.length === 0) {
    triggerBroadcasterFallback();
    return;
  }

  if (!audioEngine.player || typeof audioEngine.player.loadVideoById !== 'function') {
    initYouTubeApi();
    return;
  }

  const pickIdx = Math.floor(Math.random() * clips.length);
  const chosenClip = clips[pickIdx];
  const startSec = computeAnchorStartSeconds(chosenClip);

  audioEngine.currentClipIndex = pickIdx;
  audioEngine.currentClip = chosenClip;
  audioEngine.currentVideoId = chosenClip.id;
  audioEngine.currentVideoTitle = chosenClip.title || broadcaster.broadcaster;
  audioEngine.currentStartSeconds = startSec;

  try {
    audioEngine.player.loadVideoById({
      videoId: chosenClip.id,
      startSeconds: startSec
    });
  } catch (e) {
    audioEngine.failedVideoIds.add(chosenClip.id);
    triggerBroadcasterFallback();
    return;
  }

  schedulePlaybackWatchdog(reqId);
}

/**
 * Dedicated manual "Try Another Clip" action (`#audioNewClipBtn`).
 * Cycles to another approved video (or another approved segment if the broadcaster has 1 video)
 * from the exact same broadcaster.
 */
function switchSameBroadcasterClip() {
  if (!audioEngine.currentBroadcaster || !audioEngine.player) return;
  const reqId = ++audioEngine.loadRequestId;
  clearTimeout(audioEngine.watchdogTimer);

  const clips = getAvailableClipsForBroadcaster(audioEngine.currentBroadcaster);
  if (clips.length === 0) {
    triggerBroadcasterFallback();
    return;
  }

  const nextIdx = (audioEngine.currentClipIndex + 1) % clips.length;
  const nextClip = clips[nextIdx];
  const nextStart = computeAnchorStartSeconds(nextClip);

  audioEngine.currentClipIndex = nextIdx;
  audioEngine.currentClip = nextClip;
  audioEngine.currentVideoId = nextClip.id;
  audioEngine.currentVideoTitle = nextClip.title || audioEngine.currentBroadcaster.broadcaster;
  audioEngine.currentStartSeconds = nextStart;
  audioEngine.isPlaying = false;
  audioEngine.autoplayBlocked = false;
  audioEngine.broadcastUnavailable = false;

  updateAudioControlsUI(true);

  try {
    audioEngine.player.stopVideo();
    audioEngine.player.loadVideoById({
      videoId: nextClip.id,
      startSeconds: nextStart
    });
  } catch (e) {
    audioEngine.failedVideoIds.add(nextClip.id);
    triggerBroadcasterFallback();
    return;
  }

  if (state.status === 'revealed') {
    updateAudioRevealDetailsUI();
  }

  schedulePlaybackWatchdog(reqId);
}

/**
 * Automatic recovery if a broadcast clip fails to load or embed.
 * - Step 1: Try another unfailed clip from the same broadcaster.
 * - Step 2: Mark broadcaster failed and try another unfailed broadcaster matching
 *   the current target (same language in Language Mode; same country in Country Mode).
 * - Step 3: If no backup exists while playing, auto-regenerate a fresh round (up to 3x)
 *   or surface an unavailable state with a manual "Skip Broadcast" button.
 */
function triggerBroadcasterFallback() {
  if (!audioEngine.currentBroadcaster) return;
  clearTimeout(audioEngine.watchdogTimer);
  audioEngine.fallbackAttemptCount++;

  const broadcaster = audioEngine.currentBroadcaster;
  const clips = getAvailableClipsForBroadcaster(broadcaster);

  if (clips.length > 0 && audioEngine.fallbackAttemptCount <= clips.length) {
    switchSameBroadcasterClip();
    return;
  }

  // Every clip for this broadcaster has failed
  audioEngine.failedBroadcasterIds.add(broadcaster.id);

  if (state.currentQuestion && state.currentQuestion.isAudio) {
    if (state.currentQuestion.audioTarget === 'language') {
      const sameLangBackups = TV_NEWS_BROADCASTERS.filter(
        b =>
          b.langCode === broadcaster.langCode &&
          b.id !== broadcaster.id &&
          !audioEngine.failedBroadcasterIds.has(b.id) &&
          getAvailableClipsForBroadcaster(b).length > 0
      );
      if (sameLangBackups.length > 0) {
        const backup = sameLangBackups[Math.floor(Math.random() * sameLangBackups.length)];
        state.currentQuestion.broadcaster = backup;
        loadBroadcasterIntoPlayer(backup, false);
        return;
      }
    } else if (state.currentQuestion.audioTarget === 'country') {
      const sameCountryBackups = TV_NEWS_BROADCASTERS.filter(
        b =>
          b.countryCode === broadcaster.countryCode &&
          b.id !== broadcaster.id &&
          !audioEngine.failedBroadcasterIds.has(b.id) &&
          getAvailableClipsForBroadcaster(b).length > 0
      );
      if (sameCountryBackups.length > 0) {
        const backup = sameCountryBackups[Math.floor(Math.random() * sameCountryBackups.length)];
        state.currentQuestion.broadcaster = backup;
        loadBroadcasterIntoPlayer(backup, false);
        return;
      }
    }

    // No backup broadcaster available for this target; regenerate round cleanly while playing
    if (
      state.status === 'playing' &&
      audioEngine.roundRecoveryAttempts < 3 &&
      typeof loadNextAudioRound === 'function'
    ) {
      audioEngine.roundRecoveryAttempts++;
      loadNextAudioRound();
      return;
    }
  }

  // Exhausted automatic recovery: surface clean manual skip state instead of freezing
  audioEngine.isPlaying = false;
  audioEngine.autoplayBlocked = false;
  audioEngine.broadcastUnavailable = true;
  updateAudioControlsUI(false);
}

/**
 * Manual skip action (`#audioSkipBrokenBtn`) when a broadcast cannot be played.
 * Replaces the current round without penalizing score, streak, or lives.
 */
function skipUnavailableBroadcast() {
  if (state.appMode !== 'audio' || state.status !== 'playing') return;
  audioEngine.roundRecoveryAttempts = 0;
  audioEngine.broadcastUnavailable = false;
  if (typeof loadNextAudioRound === 'function') {
    loadNextAudioRound();
  }
}

function toggleAudioPlayPause() {
  if (!audioEngine.player || typeof audioEngine.player.getPlayerState !== 'function') return;
  audioEngine.userHasInteracted = true;
  audioEngine.autoplayBlocked = false;

  const pState = audioEngine.player.getPlayerState();
  if (pState === YT.PlayerState.PLAYING) {
    clearTimeout(audioEngine.watchdogTimer);
    audioEngine.player.pauseVideo();
  } else {
    updateAudioControlsUI(true);
    audioEngine.player.playVideo();
    schedulePlaybackWatchdog(audioEngine.loadRequestId);
  }
}

/**
 * Jumps forward 15 seconds while respecting any segment boundaries (`MO-2`, `MO-3`, `FI-1`, `IS-1`)
 * and minimum start offsets (`CA-FR-1`, `MN-1..3`).
 */
function skipAudioForward15s() {
  if (!audioEngine.player || typeof audioEngine.player.getCurrentTime !== 'function') return;
  audioEngine.userHasInteracted = true;
  audioEngine.autoplayBlocked = false;

  const cur = audioEngine.player.getCurrentTime() || audioEngine.currentStartSeconds;
  const clip = audioEngine.currentClip;

  if (clip && Array.isArray(clip.segments) && clip.segments.length > 0) {
    const currentSeg = clip.segments.find(([sMin, sMax]) => cur >= sMin - 2 && cur <= sMax);
    if (currentSeg && cur + 15 <= currentSeg[1] - 3) {
      audioEngine.player.seekTo(cur + 15, true);
    } else {
      const nextSegIdx = (audioEngine.activeSegmentIndex + 1) % clip.segments.length;
      audioEngine.activeSegmentIndex = nextSegIdx;
      const [nextStart] = clip.segments[nextSegIdx];
      audioEngine.player.seekTo(nextStart, true);
    }
    audioEngine.player.playVideo();
    return;
  }

  const minFloor = (clip && typeof clip.minStart === 'number') ? clip.minStart : 15;
  const duration = typeof audioEngine.player.getDuration === 'function' ? audioEngine.player.getDuration() : 0;
  const targetTime = (duration > 30 && cur + 15 >= duration - 5) ? minFloor : cur + 15;
  audioEngine.player.seekTo(targetTime, true);
  audioEngine.player.playVideo();
}

function toggleAudioMute() {
  if (!audioEngine.player || typeof audioEngine.player.isMuted !== 'function') return;
  if (audioEngine.player.isMuted()) {
    audioEngine.player.unMute();
    audioEngine.isMuted = false;
  } else {
    audioEngine.player.mute();
    audioEngine.isMuted = true;
  }
  updateAudioControlsUI(false);
}

function pauseAudioPlayback() {
  clearTimeout(audioEngine.watchdogTimer);
  audioEngine.isPlaying = false;
  if (audioEngine.player && typeof audioEngine.player.pauseVideo === 'function') {
    try {
      audioEngine.player.pauseVideo();
    } catch (e) {}
  }
  updateAudioControlsUI(false);
}

function stopAudioPlayback() {
  clearTimeout(audioEngine.watchdogTimer);
  clearInterval(audioEngine.segmentGuardTimer);
  audioEngine.isPlaying = false;
  audioEngine.autoplayBlocked = false;
  audioEngine.broadcastUnavailable = false;
  if (audioEngine.player && typeof audioEngine.player.stopVideo === 'function') {
    try {
      audioEngine.player.stopVideo();
    } catch (e) {}
  }
}

/**
 * Updates the video player viewport visibility and blur state based on:
 * - Whether the round has been answered (`state.status === 'revealed'`)
 * - Or the 3-state video mode (`'off'`, `'blurred'`, or `'clear'` unlocked via 6 fast clicks)
 */
function syncVideoViewportVisibility() {
  const viewportBox = document.getElementById('tvViewportWrapper');
  const iframeHolder = document.getElementById('ytIframeScaleBox');
  const blurredBadge = document.getElementById('tvBlurredOverlayBadge');
  const radioWaveBox = document.getElementById('audioRadioWaveformBox');
  if (!viewportBox || !iframeHolder || !radioWaveBox) return;

  const isRevealed = state.status === 'revealed';
  const videoMode = state.config.videoDisplayMode || (state.config.showBlurredVideo ? 'blurred' : 'off');

  if (isRevealed || videoMode === 'clear') {
    // Crystal-clear video (either after answering OR while guessing in secret 'Remove Blur' mode)
    viewportBox.classList.remove('tv-viewport-hidden');
    viewportBox.classList.add('tv-viewport-visible');
    iframeHolder.classList.remove('tv-iframe-blurred');
    iframeHolder.classList.add('tv-iframe-clear');
    if (blurredBadge) blurredBadge.classList.add('hidden');
    radioWaveBox.classList.add('hidden');
  } else if (videoMode === 'blurred') {
    // Blurred & cropped video while guessing
    viewportBox.classList.remove('tv-viewport-hidden');
    viewportBox.classList.add('tv-viewport-visible');
    iframeHolder.classList.add('tv-iframe-blurred');
    iframeHolder.classList.remove('tv-iframe-clear');
    if (blurredBadge) blurredBadge.classList.remove('hidden');
    radioWaveBox.classList.add('hidden');
  } else {
    // Audio Only (opaque waveform overlay sits above non-collapsed YouTube player)
    viewportBox.classList.add('tv-viewport-hidden');
    viewportBox.classList.remove('tv-viewport-visible');
    iframeHolder.classList.add('tv-iframe-blurred');
    iframeHolder.classList.remove('tv-iframe-clear');
    if (blurredBadge) blurredBadge.classList.add('hidden');
    radioWaveBox.classList.remove('hidden');
  }
}

function updateAudioControlsUI(isBuffering = false) {
  const dict = t();
  const playBtn = document.getElementById('audioPlayPauseBtn');
  const playIcon = document.getElementById('audioPlayBtnIcon');
  const playText = document.getElementById('audioPlayBtnText');
  const muteIcon = document.getElementById('audioMuteBtnIcon');
  const statusPill = document.getElementById('audioBroadcastStatusPill');
  const waveBars = document.getElementById('waveformBarsContainer');
  const skipBrokenBtn = document.getElementById('audioSkipBrokenBtn');

  if (playIcon && playText) {
    if (audioEngine.isPlaying) {
      playIcon.className = 'fa-solid fa-pause';
      playText.textContent = dict.audioPauseBtn || 'Pause';
    } else {
      playIcon.className = 'fa-solid fa-play';
      playText.textContent = dict.audioPlayBtn || 'Play';
    }
  }

  if (playBtn) {
    playBtn.classList.toggle('ring-2', audioEngine.autoplayBlocked);
    playBtn.classList.toggle('ring-amber-400', audioEngine.autoplayBlocked);
    playBtn.classList.toggle('animate-pulse', audioEngine.autoplayBlocked);
  }

  if (skipBrokenBtn) {
    skipBrokenBtn.classList.toggle('hidden', !audioEngine.broadcastUnavailable);
  }

  if (muteIcon) {
    muteIcon.className = audioEngine.isMuted
      ? 'fa-solid fa-volume-xmark text-rose-400'
      : 'fa-solid fa-volume-high text-indigo-400';
  }

  if (statusPill) {
    if (audioEngine.broadcastUnavailable) {
      statusPill.className = 'px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold text-[11px] flex items-center gap-1.5';
      statusPill.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-[10px]"></i> <span>${escapeHtml(dict.audioStatusUnavailable || 'Broadcast Unavailable')}</span>`;
    } else if (audioEngine.autoplayBlocked && !audioEngine.isPlaying) {
      statusPill.className = 'px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-[11px] flex items-center gap-1.5';
      statusPill.innerHTML = `<i class="fa-solid fa-hand-pointer text-[10px]"></i> <span>${escapeHtml(dict.audioStatusTapPlay || 'Tap Play to start audio')}</span>`;
    } else if (isBuffering && !audioEngine.isPlaying) {
      statusPill.className = 'px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-[11px] flex items-center gap-1.5';
      statusPill.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin text-[10px]"></i> <span>${escapeHtml(dict.audioStatusTuning || 'Tuning TV Broadcast...')}</span>`;
    } else if (audioEngine.isPlaying) {
      statusPill.className = 'px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px] flex items-center gap-1.5';
      statusPill.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> <span>${escapeHtml(dict.audioStatusOnAir || 'ON AIR')}</span>`;
    } else {
      statusPill.className = 'px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[11px] flex items-center gap-1.5';
      statusPill.innerHTML = `<i class="fa-solid fa-pause text-[10px]"></i> <span>${escapeHtml(dict.audioStatusPaused || 'Paused')}</span>`;
    }
  }

  if (waveBars) {
    waveBars.classList.toggle('waveform-active', audioEngine.isPlaying);
  }
}
