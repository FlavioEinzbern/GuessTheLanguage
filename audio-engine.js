/**
 * ============================================================================
 * YOUTUBE HYBRID AUDIO/VIDEO ENGINE (With Multi-Segment & Intro-Skip Guard)
 * ============================================================================
 * - Enforces exact timestamp ranges (`segments: [[start, end], ...]`) for
 *   videos like Macau TDM (`MO-2` & `MO-3`), Finland (`FI-1`), Iceland (`IS-1`),
 *   as well as intro skips (`minStart`) for Québec (`CA-FR-1` > 3:29) and Mongolia (`MN-1..3`).
 * - Supports 3 Video Display Modes while guessing:
 *   1. 'off'     -> Audio Only (radio waveform)
 *   2. 'blurred' -> Blurred TV Video
 *   3. 'clear'   -> Secret Unblurred TV Video (unlocked by clicking toggle 6 times fast)
 */

const audioEngine = {
  ytReady: false,
  player: null,
  isPlaying: false,
  isMuted: false,
  currentBroadcaster: null,
  currentClip: null,
  currentVideoId: null,
  currentVideoTitle: '',
  currentStartSeconds: 20,
  currentClipIndex: 0,
  activeSegmentIndex: 0,
  rssCache: new Map(),
  failedVideoIds: new Set(),
  fallbackAttemptCount: 0,
  loadRequestId: 0,
  watchdogTimer: null,
  segmentGuardTimer: null
};

/**
 * RSS Title Filter for non-curatedOnly channels:
 * Rejects 24/7 live streams, silent "No Comment" segments, intro jingles,
 * and foreign political speeches that are commonly subtitled rather than dubbed.
 */
function isCleanDomesticBroadcastTitle(title, broadcaster) {
  if (!title || typeof title !== 'string') return false;
  const lower = title.toLowerCase();

  const livestreamOrJinglePattern =
    /\b(live|livestream|en vivo|ao vivo|em direto|direto|canlı|24\/7|no comment|genérico|generico|intro|outro|abertura|vinheta|teaser|trailer|shorts|#shorts)\b/i;
  if (livestreamOrJinglePattern.test(lower)) {
    return false;
  }

  if (/\b(subtitles|subtitled|legendado|subtitulado|con subtítulos|com legendas)\b/i.test(lower)) {
    return false;
  }

  if (broadcaster && broadcaster.langCode !== 'en') {
    const foreignSpeechPattern =
      /\b(trump|biden|harris|vance|white house|pentagon|state department|zelensky|zelenskyy|putin|kremlin|netanyahu|macron|meloni|scholz|starmer|ursula von der leyen|nato|otan|un general assembly)\b/i;
    if (foreignSpeechPattern.test(lower)) {
      return false;
    }
  }

  return true;
}

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
    audioEngine.fallbackAttemptCount = 0;
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

    updateAudioControlsUI();
    if (state.status === 'revealed') {
      updateAudioRevealDetailsUI();
    }
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    audioEngine.isPlaying = false;
    updateAudioControlsUI();
  } else if (event.data === YT.PlayerState.BUFFERING) {
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
 * Background RSS Feed Fetcher (Skipped for `curatedOnly` channels so custom
 * timestamp/segment rules are never bypassed).
 */
async function fetchChannelRssVideos(broadcaster) {
  if (!broadcaster || !broadcaster.channelId || broadcaster.curatedOnly) return [];
  if (audioEngine.rssCache.has(broadcaster.channelId)) {
    return audioEngine.rssCache.get(broadcaster.channelId);
  }

  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${broadcaster.channelId}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2800);

  try {
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    const xmlText = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const entries = Array.from(xmlDoc.getElementsByTagName('entry'));

    const videos = [];
    for (const entry of entries) {
      const vidNode = entry.getElementsByTagName('yt:videoId')[0] || entry.getElementsByTagName('videoId')[0];
      const titleNode = entry.getElementsByTagName('title')[0];
      const rawTitle = titleNode ? titleNode.textContent.trim() : '';

      if (vidNode && vidNode.textContent && isCleanDomesticBroadcastTitle(rawTitle, broadcaster)) {
        videos.push({
          id: vidNode.textContent.trim(),
          title: rawTitle || broadcaster.broadcaster,
          minStart: 12,
          maxStart: 50
        });
      }
    }
    if (videos.length > 0) {
      audioEngine.rssCache.set(broadcaster.channelId, videos);
    }
    return videos;
  } catch (e) {
    clearTimeout(timer);
    return [];
  }
}

/**
 * Returns the verified clips for a broadcaster, excluding any video IDs that failed.
 */
function getAvailableClipsForBroadcaster(broadcaster) {
  if (!broadcaster) return [];
  const curated = Array.isArray(broadcaster.videos) ? broadcaster.videos : [];
  const rss = broadcaster.curatedOnly ? [] : (audioEngine.rssCache.get(broadcaster.channelId) || []);

  const mergedMap = new Map();
  curated.forEach(v => {
    if (v && v.id && !audioEngine.failedVideoIds.has(v.id)) {
      mergedMap.set(v.id, v);
    }
  });
  rss.forEach(v => {
    if (v && v.id && !audioEngine.failedVideoIds.has(v.id) && !mergedMap.has(v.id)) {
      mergedMap.set(v.id, v);
    }
  });

  const list = Array.from(mergedMap.values());
  return list.length > 0 ? list : curated;
}

/**
 * Loads a random TV news broadcast clip from the chosen broadcaster into the YouTube player.
 */
async function loadBroadcasterIntoPlayer(broadcaster, keepAttemptCount = false) {
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
  if (!keepAttemptCount) {
    audioEngine.fallbackAttemptCount = 0;
  }

  updateAudioControlsUI(true);
  syncVideoViewportVisibility();

  if (!broadcaster.curatedOnly) {
    fetchChannelRssVideos(broadcaster);
  }

  let clips = getAvailableClipsForBroadcaster(broadcaster);
  if (clips.length === 0 && !broadcaster.curatedOnly) {
    clips = await fetchChannelRssVideos(broadcaster);
    if (reqId !== audioEngine.loadRequestId) return;
  }

  if (!audioEngine.player || typeof audioEngine.player.loadVideoById !== 'function') {
    initYouTubeApi();
    return;
  }

  if (clips.length > 0) {
    const pickIdx = Math.floor(Math.random() * clips.length);
    const chosenClip = clips[pickIdx];
    const startSec = computeAnchorStartSeconds(chosenClip);

    audioEngine.currentClipIndex = pickIdx;
    audioEngine.currentClip = chosenClip;
    audioEngine.currentVideoId = chosenClip.id;
    audioEngine.currentVideoTitle = chosenClip.title || broadcaster.broadcaster;
    audioEngine.currentStartSeconds = startSec;

    audioEngine.player.loadVideoById({
      videoId: chosenClip.id,
      startSeconds: startSec
    });
  }

  audioEngine.watchdogTimer = setTimeout(() => {
    if (reqId === audioEngine.loadRequestId && !audioEngine.isPlaying && state.appMode === 'audio' && state.status === 'playing') {
      triggerBroadcasterFallback();
    }
  }, 6000);
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
  if (clips.length === 0) return;

  const nextIdx = (audioEngine.currentClipIndex + 1) % clips.length;
  const nextClip = clips[nextIdx];
  const nextStart = computeAnchorStartSeconds(nextClip);

  audioEngine.currentClipIndex = nextIdx;
  audioEngine.currentClip = nextClip;
  audioEngine.currentVideoId = nextClip.id;
  audioEngine.currentVideoTitle = nextClip.title || audioEngine.currentBroadcaster.broadcaster;
  audioEngine.currentStartSeconds = nextStart;
  audioEngine.isPlaying = false;

  updateAudioControlsUI(true);

  try {
    audioEngine.player.stopVideo();
    audioEngine.player.loadVideoById({
      videoId: nextClip.id,
      startSeconds: nextStart
    });
  } catch (e) {}

  if (state.status === 'revealed') {
    updateAudioRevealDetailsUI();
  }

  audioEngine.watchdogTimer = setTimeout(() => {
    if (reqId === audioEngine.loadRequestId && !audioEngine.isPlaying && state.appMode === 'audio' && state.status === 'playing') {
      triggerBroadcasterFallback();
    }
  }, 6000);
}

/**
 * Automatic recovery if a broadcast clip fails to buffer.
 */
function triggerBroadcasterFallback() {
  if (!audioEngine.currentBroadcaster || !audioEngine.player) return;
  clearTimeout(audioEngine.watchdogTimer);
  audioEngine.fallbackAttemptCount++;

  const clips = getAvailableClipsForBroadcaster(audioEngine.currentBroadcaster);

  if (clips.length > 0 && audioEngine.fallbackAttemptCount <= clips.length) {
    switchSameBroadcasterClip();
    return;
  }

  if (state.currentQuestion && state.currentQuestion.isAudio && state.currentQuestion.audioTarget === 'language') {
    const sameLangBroadcasters = TV_NEWS_BROADCASTERS.filter(
      b => b.langCode === audioEngine.currentBroadcaster.langCode && b.id !== audioEngine.currentBroadcaster.id
    );
    if (sameLangBroadcasters.length > 0) {
      const backup = sameLangBroadcasters[Math.floor(Math.random() * sameLangBroadcasters.length)];
      state.currentQuestion.broadcaster = backup;
      loadBroadcasterIntoPlayer(backup, false);
      return;
    }
  }
}

function toggleAudioPlayPause() {
  if (!audioEngine.player || typeof audioEngine.player.getPlayerState !== 'function') return;
  const pState = audioEngine.player.getPlayerState();
  if (pState === YT.PlayerState.PLAYING) {
    audioEngine.player.pauseVideo();
  } else {
    audioEngine.player.playVideo();
  }
}

/**
 * Jumps forward 15 seconds while respecting any segment boundaries (`MO-2`, `MO-3`, `FI-1`, `IS-1`)
 * and minimum start offsets (`CA-FR-1`, `MN-1..3`).
 */
function skipAudioForward15s() {
  if (!audioEngine.player || typeof audioEngine.player.getCurrentTime !== 'function') return;
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
  updateAudioControlsUI();
}

function stopAudioPlayback() {
  clearTimeout(audioEngine.watchdogTimer);
  clearInterval(audioEngine.segmentGuardTimer);
  audioEngine.isPlaying = false;
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
    // Audio Only (waveform shown, video hidden)
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
  const playIcon = document.getElementById('audioPlayBtnIcon');
  const playText = document.getElementById('audioPlayBtnText');
  const muteIcon = document.getElementById('audioMuteBtnIcon');
  const statusPill = document.getElementById('audioBroadcastStatusPill');
  const waveBars = document.getElementById('waveformBarsContainer');

  if (playIcon && playText) {
    if (audioEngine.isPlaying) {
      playIcon.className = 'fa-solid fa-pause';
      playText.textContent = dict.audioPauseBtn || 'Pause';
    } else {
      playIcon.className = 'fa-solid fa-play';
      playText.textContent = dict.audioPlayBtn || 'Play';
    }
  }

  if (muteIcon) {
    muteIcon.className = audioEngine.isMuted ? 'fa-solid fa-volume-xmark text-rose-400' : 'fa-solid fa-volume-high text-indigo-400';
  }

  if (statusPill) {
    if (isBuffering && !audioEngine.isPlaying) {
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
