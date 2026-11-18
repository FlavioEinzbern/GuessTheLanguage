/**
 * ============================================================================
 * YOUTUBE HYBRID AUDIO/VIDEO ENGINE (Option A/B Hybrid)
 * ============================================================================
 * - Loads official YouTube IFrame API
 * - Fetches recent channel broadcasts via RSS XML feed (Option A) + Channel
 *   Uploads Playlists & curated broadcast IDs (Option B)
 * - Seeks to random timestamps (`startSeconds`) so clips start mid-broadcast
 * - Manages Blurred Video Mode vs Audio-Only Mode during guessing, and
 *   automatically un-blurs and reveals the actual video + title after guessing
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
  currentPlaylistIndex: 0,
  rssCache: new Map(), // channelId -> [{ videoId, title }]
  fallbackAttemptCount: 0,
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

  audioEngine.player = new YT.Player('ytPlayerElement', {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      playsinline: 1
    },
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

    // Extract actual video ID and title from the live YouTube player
    try {
      const data = audioEngine.player.getVideoData();
      if (data) {
        if (data.video_id) audioEngine.currentVideoId = data.video_id;
        if (data.title) audioEngine.currentVideoTitle = data.title;
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
  triggerBroadcasterFallback();
}

/**
 * Option A: Background RSS Feed Fetcher (fetches latest 15 videos from a channel's public XML feed)
 */
async function fetchChannelRssVideos(broadcaster) {
  if (!broadcaster || !broadcaster.channelId) return [];
  if (audioEngine.rssCache.has(broadcaster.channelId)) {
    return audioEngine.rssCache.get(broadcaster.channelId);
  }

  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${broadcaster.channelId}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3200);

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
          videoId: vidNode.textContent.trim(),
          title: titleNode ? titleNode.textContent.trim() : broadcaster.broadcaster
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
 * Loads a random TV news broadcast clip from the chosen broadcaster into the YouTube player.
 */
async function loadBroadcasterIntoPlayer(broadcaster) {
  audioEngine.currentBroadcaster = broadcaster;
  audioEngine.currentVideoId = null;
  audioEngine.currentVideoTitle = '';
  audioEngine.isPlaying = false;
  audioEngine.currentStartSeconds = Math.floor(Math.random() * 90) + 25; // 25s to 115s
  audioEngine.currentPlaylistIndex = Math.floor(Math.random() * 8);

  updateAudioControlsUI(true);
  syncVideoViewportVisibility();

  // Warm up RSS videos asynchronously
  fetchChannelRssVideos(broadcaster).then(rssList => {
    if (rssList.length > 0 && !audioEngine.currentVideoTitle && audioEngine.currentVideoId) {
      const found = rssList.find(v => v.videoId === audioEngine.currentVideoId);
      if (found) audioEngine.currentVideoTitle = found.title;
    }
  });

  if (!audioEngine.player || typeof audioEngine.player.loadPlaylist !== 'function') {
    initYouTubeApi();
    return;
  }

  clearTimeout(audioEngine.watchdogTimer);

  // Check if we already have cached RSS videos for this channel
  const cachedRss = audioEngine.rssCache.get(broadcaster.channelId);
  if (cachedRss && cachedRss.length > 0 && audioEngine.fallbackAttemptCount === 0) {
    const pick = cachedRss[Math.floor(Math.random() * Math.min(cachedRss.length, 10))];
    audioEngine.currentVideoId = pick.videoId;
    audioEngine.currentVideoTitle = pick.title;
    audioEngine.player.loadVideoById({
      videoId: pick.videoId,
      startSeconds: audioEngine.currentStartSeconds
    });
  } else {
    // Load directly from the official Channel Uploads Playlist (UU...)
    audioEngine.player.loadPlaylist({
      list: broadcaster.uploadsList,
      listType: 'playlist',
      index: audioEngine.currentPlaylistIndex,
      startSeconds: audioEngine.currentStartSeconds
    });
  }

  audioEngine.watchdogTimer = setTimeout(() => {
    if (!audioEngine.isPlaying && state.appMode === 'audio' && state.status === 'playing') {
      triggerBroadcasterFallback();
    }
  }, 5000);
}

/**
 * Automatic recovery if a specific broadcast clip blocks third-party embedding or fails to buffer.
 */
function triggerBroadcasterFallback() {
  if (!audioEngine.currentBroadcaster || !audioEngine.player) return;
  audioEngine.fallbackAttemptCount++;

  if (audioEngine.fallbackAttemptCount <= 2) {
    // Try another index in the channel's uploads playlist
    const nextIdx = (audioEngine.currentPlaylistIndex + audioEngine.fallbackAttemptCount * 2) % 10;
    const nextStart = Math.floor(Math.random() * 60) + 15;
    try {
      audioEngine.player.loadPlaylist({
        list: audioEngine.currentBroadcaster.uploadsList,
        listType: 'playlist',
        index: nextIdx,
        startSeconds: nextStart
      });
    } catch (e) {}
    return;
  }

  // Switch to another broadcaster with the same language or region if available
  const sameLang = TV_NEWS_BROADCASTERS.filter(
    b => b.langCode === audioEngine.currentBroadcaster.langCode && b.id !== audioEngine.currentBroadcaster.id
  );
  if (sameLang.length > 0) {
    audioEngine.fallbackAttemptCount = 0;
    const backup = sameLang[Math.floor(Math.random() * sameLang.length)];
    loadBroadcasterIntoPlayer(backup);
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
  audioEngine.player.seekTo(cur + 15, true);
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
    // Post-Guess Reveal: ALWAYS show the actual clear video!
    viewportBox.classList.remove('tv-viewport-hidden');
    viewportBox.classList.add('tv-viewport-visible');
    iframeHolder.classList.remove('tv-iframe-blurred');
    iframeHolder.classList.add('tv-iframe-clear');
    if (blurredBadge) blurredBadge.classList.add('hidden');
    radioWaveBox.classList.add('hidden');
  } else if (showVideoWhileGuessing) {
    // Guessing with Video ON: Show heavily blurred & cropped TV screen
    viewportBox.classList.remove('tv-viewport-hidden');
    viewportBox.classList.add('tv-viewport-visible');
    iframeHolder.classList.add('tv-iframe-blurred');
    iframeHolder.classList.remove('tv-iframe-clear');
    if (blurredBadge) blurredBadge.classList.remove('hidden');
    radioWaveBox.classList.add('hidden');
  } else {
    // Guessing with Video OFF: Hide video frame, show sleek Radio Audio Waveform
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