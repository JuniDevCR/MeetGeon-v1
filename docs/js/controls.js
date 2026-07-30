// Botones
const micBtn = document.getElementById("micBtn");
const camBtn = document.getElementById("camBtn");

// Micrófono
micBtn.addEventListener("click", () => {
  const audioTrack = localStream.getAudioTracks()[0];

  if (audioTrack.enabled) {
    audioTrack.enabled = false;

    micBtn.innerHTML = '<i class="bi bi-mic-mute-fill"></i>';
  } else {
    audioTrack.enabled = true;

    micBtn.innerHTML = '<i class="bi bi-mic-fill"></i>';
  }
});

// Cámara
camBtn.addEventListener("click", () => {
  const videoTrack = localStream.getVideoTracks()[0];

  if (videoTrack.enabled) {
    videoTrack.enabled = false;

    camBtn.innerHTML = '<i class="bi bi-camera-video-off-fill"></i>';
  } else {
    videoTrack.enabled = true;

    camBtn.innerHTML = '<i class="bi bi-camera-video-fill"></i>';
  }
});
