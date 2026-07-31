document.addEventListener("DOMContentLoaded", () => {
  const statusText = document.getElementById("status");
  const subStatus = document.getElementById("sub-status");
  const remoteVideo = document.getElementById("remoteVideo");
  const startBtn = document.getElementById("startBtn");

  // Controles móviles
  const controlsBar = document.getElementById("controlsBar");
  const mobileMicBtn = document.getElementById("mobileMicBtn");
  const mobileCamBtn = document.getElementById("mobileCamBtn");
  const mobileHangupBtn = document.getElementById("mobileHangupBtn");

  let localStream = null;

  const urlParams = new URLSearchParams(window.location.search);
  const targetPeerId = urlParams.get("peer");

  if (!targetPeerId) {
    statusText.innerText = "Error: Enlace inválido.";
    if (startBtn) startBtn.style.display = "none";
    return;
  }

  startBtn.addEventListener("click", async () => {
    startBtn.style.display = "none";
    statusText.innerText = "Iniciando cámara y micrófono...";

    try {
      // 1. Obtener la cámara/micrófono del teléfono
      localStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });

      statusText.innerText = "Conectando con el servidor...";

      const peer = new Peer({
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      });

      peer.on("open", () => {
        statusText.innerText = "Llamando a la PC...";

        const call = peer.call(targetPeerId, localStream);

        call.on("stream", (remoteStream) => {
          statusText.innerText = "¡Conectado a la reunión!";
          if (subStatus) subStatus.style.display = "none";
          if (controlsBar) controlsBar.style.display = "flex"; // Mostrar la barra de botones

          if (remoteVideo) {
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play();
          }
        });

        call.on("close", () => {
          statusText.innerText = "Llamada finalizada";
          if (controlsBar) controlsBar.style.display = "none";
        });

        // Colgar llamada
        if (mobileHangupBtn) {
          mobileHangupBtn.addEventListener("click", () => {
            call.close();
            window.location.reload();
          });
        }
      });
    } catch (err) {
      console.error("Error al acceder a los medios:", err);
      statusText.innerText = "Acceso denegado a la cámara o micrófono.";
      startBtn.style.display = "inline-block";
    }
  });

  // --- CONTROLES MÓVILES (MIC Y CÁMARA) ---

  if (mobileMicBtn) {
    mobileMicBtn.addEventListener("click", () => {
      if (!localStream) return;
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        mobileMicBtn.classList.toggle("btn-danger", !audioTrack.enabled);
        mobileMicBtn.classList.toggle("btn-secondary", audioTrack.enabled);
        const icon = mobileMicBtn.querySelector("i");
        if (icon) {
          icon.className = audioTrack.enabled
            ? "bi bi-mic-fill fs-4"
            : "bi bi-mic-mute-fill fs-4";
        }
      }
    });
  }

  if (mobileCamBtn) {
    mobileCamBtn.addEventListener("click", () => {
      if (!localStream) return;
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        mobileCamBtn.classList.toggle("btn-danger", !videoTrack.enabled);
        mobileCamBtn.classList.toggle("btn-secondary", videoTrack.enabled);
        const icon = mobileCamBtn.querySelector("i");
        if (icon) {
          icon.className = videoTrack.enabled
            ? "bi bi-camera-video-fill fs-4"
            : "bi bi-camera-video-off-fill fs-4";
        }
      }
    });
  }
});
