// Add your public playlist ID before sharing the site.
const CONFIG = {
  playlistId: "PLB9kc9nPUmyk",
  loveNote: `My Pyaaru Bebu,

Every time I think about us, I’m reminded of how distance never stood a chance against what we have. Four years apart, yet every message, every call, every memory has kept you closer than anyone else could ever be. You’ve been my calm in chaos, my reason to smile when the world feels heavy, and my favorite thought at the end of every day.

I still remember the rain that morning — how it felt like the universe was testing our patience, only to bless our meeting with its rhythm. That day wasn’t just a reunion; it was a reminder that love always finds its way, no matter how far, how long, or how uncertain.

You are my melody, my muse, my forever song. Every beat of my heart hums your name, and every sunrise feels softer knowing you exist somewhere under the same sky.

No matter where life takes us, I’ll keep choosing you — again and again — because you’re not just my love, Aarna, you’re my home.

Forever yours,
Abhishek 💗`,
};

const $ = (id) => document.getElementById(id);
let player, isReady = false, isMuted = false, hasStarted = false;
let seeking = false;
const invalidPlaylist = CONFIG.playlistId.startsWith("PASTE_");

function onYouTubeIframeAPIReady() {
  if (invalidPlaylist || player) return;
  player = new YT.Player("youtube-player", {
    // YouTube requires a 200×200 player; CSS keeps that player entirely off screen.
    height: "200", width: "200",
    playerVars: { listType:"playlist", list:CONFIG.playlistId, autoplay:0, controls:0, modestbranding:1, rel:0, origin:window.location.origin, playsinline:1 },
    events: { onReady, onStateChange, onError },
  });
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
// Covers the rare case where YouTube's API finishes loading before this file.
if (window.YT?.Player) onYouTubeIframeAPIReady();

function onReady() { isReady=true; player.setVolume(70); player.setShuffle(true); $("track-artist").textContent="Ready when you are ♡"; }
function onStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) { $("play-pause").textContent="❚❚"; $("play-pause").setAttribute("aria-label","Pause"); updateCurrent(); }
  if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) { $("play-pause").textContent="▶"; $("play-pause").setAttribute("aria-label","Play"); }
}
function onError(event) { console.warn("YouTube player error:",event.data); $("track-artist").textContent="That video can’t be played here — trying the next song…"; setTimeout(()=>player?.nextVideo(),700); }
function playRandomTrack() {
  const tracks=player?.getPlaylist() || [];
  if (tracks.length) player.playVideoAt(Math.floor(Math.random()*tracks.length));
  else player?.playVideo();
  hasStarted=true;
}
function togglePlay() {
  if (invalidPlaylist) { $("track-artist").textContent="Please add the complete playlist ID in script.js."; return; }
  if (!isReady) return;
  if (player.getPlayerState()===YT.PlayerState.PLAYING) player.pauseVideo();
  else if (!hasStarted) playRandomTrack();
  else player.playVideo();
}
function updateCurrent() { $("track-title").textContent=player.getVideoData()?.title || "Our song"; $("track-artist").textContent="From our playlist"; }
function formatTime(seconds) { const value=Math.max(0,Math.floor(seconds || 0)); return `${Math.floor(value/60)}:${String(value%60).padStart(2,"0")}`; }
function updateTimeline() {
  if (!player || !isReady || seeking) return;
  const total=player.getDuration() || 0, current=player.getCurrentTime() || 0;
  $("elapsed").textContent=formatTime(current); $("duration").textContent=formatTime(total);
  $("progress").value=total ? (current/total)*100 : 0;
}

$("play-pause").onclick=togglePlay;
$("next").onclick=()=>player?.nextVideo(); $("previous").onclick=()=>player?.previousVideo();
$("shuffle").onclick=()=>{ if (!player) return; player.setShuffle(true); playRandomTrack(); $("track-artist").textContent="A fresh shuffle, just for you ♡"; };
$("mute").onclick=()=>{ if (!player) return; isMuted=!isMuted; isMuted ? player.mute() : player.unMute(); $("mute").textContent=isMuted?"◒":"◔"; };
$("volume").oninput=(e)=>{ if (player) { player.setVolume(e.target.value); if (+e.target.value>0) { player.unMute(); isMuted=false; $("mute").textContent="◔"; } } };
$("progress").addEventListener("pointerdown",()=>{ seeking=true; });
$("progress").addEventListener("input",(e)=>{ const total=player?.getDuration() || 0; $("elapsed").textContent=formatTime((e.target.value/100)*total); });
$("progress").addEventListener("change",(e)=>{ const total=player?.getDuration() || 0; if (total) player?.seekTo((e.target.value/100)*total,true); seeking=false; });
$("love-note-text").textContent=CONFIG.loveNote;
$("love-note-button").onclick=()=>$("note-dialog").showModal(); $("close-note").onclick=()=>$("note-dialog").close();
$("clock-button").onclick=()=>$("clock-dialog").showModal(); $("close-clock-message").onclick=()=>$("clock-dialog").close();
$("night-toggle").onclick=()=>{ const active=document.body.classList.toggle("night-mode"); $("night-toggle").setAttribute("aria-pressed",String(active)); $("night-toggle").setAttribute("aria-label",active?"Return to photo background":"Show night sky background"); };
const playlistUrl=invalidPlaylist ? "#" : `https://www.youtube.com/playlist?list=${encodeURIComponent(CONFIG.playlistId)}`;
$("playlist-link").href=playlistUrl; $("playlist-shortcut").href=playlistUrl;
$("voice-button").onclick=()=>{ speechSynthesis.cancel(); const speech=new SpeechSynthesisUtterance("Your baby loves you the most in this entire world."); speech.rate=.9; speech.pitch=1.12; speechSynthesis.speak(speech); };
function tick(){ $("clock").textContent=new Intl.DateTimeFormat([], {hour:"2-digit",minute:"2-digit"}).format(new Date()); } tick(); setInterval(tick,1000);
setInterval(updateTimeline,500);
