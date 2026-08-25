document.addEventListener("DOMContentLoaded", () => {
  const statusText = document.getElementById("status");
  const remoteVideo = document.getElementById("remoteVideo");
  const startBtn = document.getElementById("startBtn");

  const controlsBar = document.getElementById("controlsBar");
  const mobileMicBtn = document.getElementById("mobileMicBtn");
  const mobileCamBtn = document.getElementById("mobileCamBtn");
  const mobileHangupBtn = document.getElementById("mobileHangupBtn");

  let localStream = null;
  let activeCall = null;

  const urlParams = new URLSearchParams(window.location.search);
  const targetPeerId = urlParams.get("peer");

  if (!targetPeerId) {
    statusText.innerText = "Error: Enlace de reunión no válido.";
    if (startBtn) startBtn.style.display = "none";
    return;
  }

  startBtn.addEventListener("click", async () => {
    startBtn.style.display = "none";
    statusText.innerText = "Iniciando cámara y micrófono...";

    try {
      // 1. Obtener stream local del celular
      localStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });

      // Mostrar inmediatamente la barra de controles móviles
      if (controlsBar) controlsBar.style.display = "flex";

      statusText.innerText = "Conectando...";

      const peer = new Peer({
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      });

      peer.on("open", () => {
        statusText.innerText = "Llamando a la sala...";

        activeCall = peer.call(targetPeerId, localStream);

        activeCall.on("stream", (remoteStream) => {
          statusText.innerText = "¡Conectado!";
          if (remoteVideo) {
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play();
          }
        });

        activeCall.on("close", () => {
          statusText.innerText = "Llamada finalizada";
          if (controlsBar) controlsBar.style.display = "none";
        });
      });
    } catch (err) {
      console.error("Error al acceder a los medios:", err);
      statusText.innerText = "Permisos de cámara o micrófono denegados.";
      startBtn.style.display = "inline-block";
      if (controlsBar) controlsBar.style.display = "none";
    }
  });

  // --- MANEJO DE BOTONES MÓVILES ---

  // Micrófono Móvil
  if (mobileMicBtn) {
    mobileMicBtn.addEventListener("click", () => {
      if (!localStream) return;
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        mobileMicBtn.className = audioTrack.enabled
          ? "btn btn-secondary rounded-circle p-3"
          : "btn btn-danger rounded-circle p-3";
        const icon = mobileMicBtn.querySelector("i");
        if (icon) {
          icon.className = audioTrack.enabled
            ? "bi bi-mic-fill fs-4"
            : "bi bi-mic-mute-fill fs-4";
        }
      }
    });
  }

  // Cámara Móvil
  if (mobileCamBtn) {
    mobileCamBtn.addEventListener("click", () => {
      if (!localStream) return;
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        mobileCamBtn.className = videoTrack.enabled
          ? "btn btn-secondary rounded-circle p-3"
          : "btn btn-danger rounded-circle p-3";
        const icon = mobileCamBtn.querySelector("i");
        if (icon) {
          icon.className = videoTrack.enabled
            ? "bi bi-camera-video-fill fs-4"
            : "bi bi-camera-video-off-fill fs-4";
        }
      }
    });
  }

  // Colgar Móvil
  if (mobileHangupBtn) {
    mobileHangupBtn.addEventListener("click", () => {
      if (activeCall) activeCall.close();
      window.location.reload();
    });
  }
});
s;
