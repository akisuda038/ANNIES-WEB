// Robust player script: initialize after DOM is ready
function initPlayer() {
  const tracks = [
    {src: 'assets/Rewind.mp3', label: 'Rewind', cover: 're/random.png', bg: 'linear-gradient(180deg, #ffd8e8 0%, #ffeefd 100%)'},
    {src: 'assets/SpoMp3 ASAP NewJeans.mp3', label: 'ASAP', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #e2d2ff 0%, #f6e9ff 100%)'},
    {src: 'assets/SpoMp3 Bubble Gum NewJeans.mp3', label: 'Bubble Gum', cover: 're/how sweet.png', bg: 'linear-gradient(180deg, #fff1d8 0%, #ffe8f0 100%)'},
    {src: 'assets/SpoMp3 Cool With You NewJeans.mp3', label: 'Cool With You', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #dbe9ff 0%, #f7f0ff 100%)'},
    {src: 'assets/SpoMp3 Ditto NewJeans.mp3', label: 'Ditto', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #f7e5ff 0%, #ffe6f2 100%)'},
    {src: 'assets/SpoMp3 ETA NewJeans.mp3', label: 'ETA', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #d6f2ff 0%, #effbff 100%)'},
    {src: 'assets/SpoMp3 Get Up NewJeans.mp3', label: 'Get Up', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #ffe6d6 0%, #fff5ec 100%)'},
    {src: 'assets/SpoMp3 Hype Boy NewJeans.mp3', label: 'Hype Boy', cover: 're/bunny blue.png', bg: 'linear-gradient(180deg, #d8f3ff 0%, #f0fbff 100%)'},
    {src: 'assets/SpoMp3 New Jeans NewJeans.mp3', label: 'New Jeans', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #f0d9ff 0%, #fff5ff 100%)'},
    {src: 'assets/SpoMp3 OMG NewJeans.mp3', label: 'OMG', cover: 're/bunny black.png', bg: 'linear-gradient(180deg, #f4edff 0%, #e7f0ff 100%)'},
    {src: 'assets/SpoMp3 Rewind Wonder Girls.mp3', label: 'Rewind Wonder Girls', cover: 're/random.png', bg: 'linear-gradient(180deg, #ffe6ea 0%, #fff0f5 100%)'},
    {src: 'assets/SpoMp3 Right Now NewJeans.mp3', label: 'Right Now', cover: 're/supernatural.png', bg: 'linear-gradient(180deg, #dff2ef 0%, #eaf9f7 100%)'},
    {src: 'assets/SpoMp3 Super Shy NewJeans.mp3', label: 'Super Shy', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #f8e0ff 0%, #fff4ff 100%)'},
    {src: 'assets/SpoMp3 Supernatural NewJeans.mp3', label: 'Supernatural', cover: 're/supernatural.png', bg: 'linear-gradient(180deg, #e2f7ff 0%, #f3f9ff 100%)'}
  ];

  let currentSongIndex = null;
  const audio = document.getElementById('myAudio');
  const playBtn = document.getElementById('playBtn');
  const randomBtn = document.getElementById('randomBtn');
  const statusEl = document.getElementById('status');
  const trackName = document.getElementById('trackName');
  const trackCover = document.getElementById('trackCover');

  function chooseRandomSong() {
    return Math.floor(Math.random() * tracks.length);
  }

  function setTrack(index) {
    currentSongIndex = index;
    const track = tracks[index];
    if (!track) return;
    audio.src = encodeURI(track.src);
    if (trackCover) {
      trackCover.src = track.cover;
      trackCover.alt = track.label + ' cover';
    }
    if (statusEl) statusEl.textContent = 'Loading ' + track.label;
    if (track.bg) {
      document.body.style.background = track.bg;
    }
    try { audio.load(); } catch (e) { /* ignore */ }
    trackName.textContent = track.label;
  }

  // Attach error/debug listeners
  audio.addEventListener('error', (e) => {
    const err = audio.error;
    console.error('Audio element error', err);
    if (statusEl) statusEl.textContent = 'Audio error: code=' + (err && err.code) + ' readyState=' + audio.readyState;
  });
  audio.addEventListener('stalled', () => { if (statusEl) statusEl.textContent = 'Stalled while loading'; });
  audio.addEventListener('suspend', () => { if (statusEl) statusEl.textContent = 'Loading suspended'; });
  audio.addEventListener('canplaythrough', () => { if (statusEl) statusEl.textContent = 'Ready to play'; });

  function tryPlay() {
    return audio.play().then(() => {
      if (statusEl) statusEl.textContent = 'Playing';
      return true;
    }).catch((err) => {
      console.warn('Playback blocked:', err);
      if (statusEl) statusEl.textContent = 'Playback blocked. Use http server or allow media playback.';
      return false;
    });
  }

  async function playTrack(index) {
    setTrack(index);
    const ok = await tryPlay();
    playBtn.textContent = ok ? '⏸ Pause Music' : '▶ Play';
  }

  async function randomizeSong() {
    const idx = chooseRandomSong();
    currentSongIndex = idx;
    await playTrack(idx);
  }

  async function toggleMusic() {
    if (!audio.src) {
      const idx = chooseRandomSong();
      currentSongIndex = idx;
      await playTrack(idx);
      return;
    }
    if (audio.paused) {
      const ok = await tryPlay();
      if (ok) {
        playBtn.textContent = '⏸ Pause Music';
      }
    } else {
      audio.pause();
      playBtn.textContent = '▶ Play';
    }
  }

  playBtn.addEventListener('click', toggleMusic);
  randomBtn.addEventListener('click', randomizeSong);

  // show a preview name (random) without loading the file
  const pre = chooseRandomSong();
  const preview = tracks[pre];
  if (preview) {
    trackName.textContent = preview.label;
    if (trackCover) {
      trackCover.src = preview.cover;
      trackCover.alt = preview.label + ' cover';
    }
    if (preview.bg) {
      document.body.style.background = preview.bg;
    }
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initPlayer);
} else {
  // DOM already ready
  initPlayer();
}
