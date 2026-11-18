/**
 * ============================================================================
 * YOUTUBE HYBRID AUDIO/VIDEO ENGINE (Option A/B Hybrid — Error 153 & Sync Fixed)
 * ============================================================================
 * - Loads official YouTube IFrame API with valid `origin` on http/https
 * - Immediately stops previous round's video (`stopVideo()`) before loading the
 *   new broadcaster so a previous channel (e.g., PBS NewsHour) can NEVER bleed
 *   into a new round (e.g., NOS Journaal)
 * - Uses `loadVideoById()` with verified broadcast IDs from `audio-data.js`
 *   plus background RSS discovery instead of raw `UU...` playlist IDs
 * - Keeps `state.currentQuestion.broadcaster` 100% synchronized on fallback
 */

const audioEngine = {
  ytReady: false,
  player: null,
  isPlaying: false,
  isMuted: false,
  currentBroadcaster: null,
  currentVideoId: null,
  currentVideoTitle: '',
  currentStartSeconds: 30,
  currentClipIndex: 0,
  rssCache: new Map(), // channelId -> [{ id, title, maxStart }]
  failedVideoIds: new Set(),
  fallbackAttemptCount: 0,
  loadRequestId: 0,
  watchdogTimer: null
};

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

  // Pass origin when hosted on http:// or https:// (such as GitHub Pages)
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

    // Verify the playing video matches our expected videoId before reading its title
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
 * Option A: Background RSS Feed Fetcher (fetches latest videos from a channel's public XML feed)
 */
async function fetchChannelRssVideos(broadcaster) {
  if (!broadcaster || !broadcaster.channelId) return [];
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
      if (vidNode && vidNode.textContent) {
        videos.push({
          id: vidNode.textContent.trim(),
          title: titleNode ? titleNode.textContent.trim() : broadcaster.broadcaster,
          maxStart: 90
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
 * Returns the combined list of verified clips + cached RSS clips for a broadcaster,
 * excluding any video IDs that previously threw an embed error.
 */
function getAvailableClipsForBroadcaster(broadcaster) {
  if (!broadcaster) return [];
  const curated = Array.isArray(broadcaster.videos) ? broadcaster.videos : [];
  const rss = audioEngine.rssCache.get(broadcaster.channelId) || [];

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
 * Immediately stops any previous video so audio from the last round can never bleed over.
 */
async function loadBroadcasterIntoPlayer(broadcaster, keepAttemptCount = false) {
  const reqId = ++audioEngine.loadRequestId;
  clearTimeout(audioEngine.watchdogTimer);

  // Immediately stop the previous round's video so it can never keep playing!
  if (audioEngine.player && typeof audioEngine.player.stopVideo === 'function') {
    try {
      audioEngine.player.stopVideo();
    } catch (e) {}
  }

  audioEngine.currentBroadcaster = broadcaster;
  audioEngine.currentVideoId = null;
  audioEngine.currentVideoTitle = '';
  audioEngine.isPlaying = false;
  if (!keepAttemptCount) {
    audioEngine.fallbackAttemptCount = 0;
  }

  updateAudioControlsUI(true);
  syncVideoViewportVisibility();

  // Warm up RSS cache in background for future clips
  fetchChannelRssVideos(broadcaster);

  let clips = getAvailableClipsForBroadcaster(broadcaster);
  if (clips.length === 0) {
    // If no curated clips, await RSS feed before attempting playback
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
    const maxStart = chosenClip.maxStart || 120;
    const minStart = Math.min(12, Math.floor(maxStart / 3));
    const randomStart = Math.floor(Math.random() * Math.max(10, maxStart - minStart)) + minStart;

    audioEngine.currentClipIndex = pickIdx;
    audioEngine.currentVideoId = chosenClip.id;
    audioEngine.currentVideoTitle = chosenClip.title || broadcaster.broadcaster;
    audioEngine.currentStartSeconds = randomStart;

    audioEngine.player.loadVideoById({
      videoId: chosenClip.id,
      startSeconds: randomStart
    });
  }

  audioEngine.watchdogTimer = setTimeout(() => {
    if (reqId === audioEngine.loadRequestId && !audioEngine.isPlaying && state.appMode === 'audio' && state.status === 'playing') {
      triggerBroadcasterFallback();
    }
  }, 6000);
}

/**
 * Automatic recovery if a specific broadcast clip blocks third-party embedding or fails to buffer.
 * First tries other verified videos from the EXACT same broadcaster; if switching broadcasters,
 * keeps `state.currentQuestion.broadcaster` 100% synchronized.
 */
function triggerBroadcasterFallback() {
  if (!audioEngine.currentBroadcaster || !audioEngine.player) return;
  clearTimeout(audioEngine.watchdogTimer);
  audioEngine.fallbackAttemptCount++;

  const clips = getAvailableClipsForBroadcaster(audioEngine.currentBroadcaster);

  // Step 1: Try another verified video clip from the SAME broadcaster
  if (clips.length > 0 && audioEngine.fallbackAttemptCount <= clips.length) {
    const nextIdx = (audioEngine.currentClipIndex + 1) % clips.length;
    const nextClip = clips[nextIdx];
    const maxStart = nextClip.maxStart || 90;
    const nextStart = Math.floor(Math.random() * Math.max(10, maxStart - 10)) + 10;

    audioEngine.currentClipIndex = nextIdx;
    audioEngine.currentVideoId = nextClip.id;
    audioEngine.currentVideoTitle = nextClip.title || audioEngine.currentBroadcaster.broadcaster;
    audioEngine.currentStartSeconds = nextStart;

    try {
      audioEngine.player.stopVideo();
      audioEngine.player.loadVideoById({
        videoId: nextClip.id,
        startSeconds: nextStart
      });
    } catch (e) {}

    const reqId = audioEngine.loadRequestId;
    audioEngine.watchdogTimer = setTimeout(() => {
      if (reqId === audioEngine.loadRequestId && !audioEngine.isPlaying && state.appMode === 'audio' && state.status === 'playing') {
        triggerBroadcasterFallback();
      }
    }, 6000);
    return;
  }

  // Step 2: If Guessing Language, we can switch to a sister broadcaster of the EXACT same language
  // and update `state.currentQuestion.broadcaster` so the reveal metadata stays 100% accurate.
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

function skipAudioForward15s() {
  if (!audioEngine.player || typeof audioEngine.player.getCurrentTime !== 'function') return;
  const cur = audioEngine.player.getCurrentTime() || audioEngine.currentStartSeconds;
  const duration = typeof audioEngine.player.getDuration === 'function' ? audioEngine.player.getDuration() : 0;
  const targetTime = (duration > 30 && cur + 15 >= duration - 5) ? 15 : cur + 15;
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
  audioEngine.isPlaying = false;
  if (audioEngine.player && typeof audioEngine.player.stopVideo === 'function') {
    try {
      audioEngine.player.stopVideo();
    } catch (e) {}
  }
}

/**
 * Controls the 3 visual states of the TV video viewport:
 * 1. Guessing + Video Toggle OFF -> Video hidden, Audio Radio Waveform shown
 * 2. Guessing + Video Toggle ON  -> Blurred & cropped TV screen shown (no titles/chyrons readable)
 * 3. Post-Guess Revealed         -> Actual clear video ALWAYS shown!
 */
function syncVideoViewportVisibility() {
  const viewportBox = document.getElementById('tvViewportWrapper');
  const iframeHolder = document.getElementById('ytIframeScaleBox');
  const blurredBadge = document.getElementById('tvBlurredOverlayBadge');
  const radioWaveBox = document.getElementById('audioRadioWaveformBox');
  if (!viewportBox || !iframeHolder || !radioWaveBox) return;

  const isRevealed = state.status === 'revealed';
  const showVideoWhileGuessing = state.config.showBlurredVideo;

  if (isRevealed) {
    viewportBox.classList.remove('tv-viewport-hidden');
    viewportBox.classList.add('tv-viewport-visible');
    iframeHolder.classList.remove('tv-iframe-blurred');
    iframeHolder.classList.add('tv-iframe-clear');
    if (blurredBadge) blurredBadge.classList.add('hidden');
    radioWaveBox.classList.add('hidden');
  } else if (showVideoWhileGuessing) {
    viewportBox.classList.remove('tv-viewport-hidden');
    viewportBox.classList.add('tv-viewport-visible');
    iframeHolder.classList.add('tv-iframe-blurred');
    iframeHolder.classList.remove('tv-iframe-clear');
    if (blurredBadge) blurredBadge.classList.remove('hidden');
    radioWaveBox.classList.add('hidden');
  } else {
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
