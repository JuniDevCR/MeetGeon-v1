document.addEventListener("DOMContentLoaded", async () => {
  const remoteVideo = document.getElementById("remoteVideo");
  const localVideo = document.getElementById("localVideo");
  const qrContainer = document.getElementById("qr-container");
  const statusTitle = document.getElementById("status-title");
  const mobileStatus = document.getElementById("mobile-status");

  // Botones de control en la PC
  const micBtn = document.getElementById("micBtn");
  const camBtn = document.getElementById("camBtn");
  const leaveBtn = document.querySelector(".leave-btn"); // Botón de colgar en tu HTML

  let localStream = null;
  let currentCall = null;

  // 1. Obtener la cámara local de la PC
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideo) localVideo.srcObject = localStream;
  } catch (err) {
    console.error("No se pudo acceder a la cámara o micrófono de la PC:", err);
    if (statusTitle)
      statusTitle.innerText = "Error: Concede permisos de cámara";
  }

  // 2. Inicializar PeerJS
  const peer = new Peer({
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    },
  });

  peer.on("open", (peerId) => {
    const currentFolder = window.location.href.substring(
      0,
      window.location.href.lastIndexOf("/"),
    );
    const callUrl = `${currentFolder}/mobile.html?peer=${peerId}`;

    if (qrContainer) {
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, {
        text: callUrl,
        width: 180,
        height: 180,
      });
    }
  });

  // 3. Responder llamada entrante
  peer.on("call", (call) => {
    currentCall = call;
    if (statusTitle) statusTitle.innerText = "Conectando con el móvil...";

    call.answer(localStream);

    call.on("stream", (remoteStream) => {
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
        remoteVideo.play();
      }
      if (statusTitle) statusTitle.innerText = "¡Participante conectado!";
      if (mobileStatus) mobileStatus.innerText = "Conectado";
      if (qrContainer) qrContainer.style.display = "none";
    });

    call.on("close", () => {
      if (statusTitle) statusTitle.innerText = "Participante desconectado";
      if (mobileStatus) mobileStatus.innerText = "Desconectado";
      if (remoteVideo) remoteVideo.srcObject = null;
    });
  });

  // --- CONTROLES DE LA PC ---

  // Activar/Desactivar Micrófono PC
  if (micBtn) {
    micBtn.addEventListener("click", () => {
      if (!localStream) return;
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        micBtn.style.backgroundColor = audioTrack.enabled ? "" : "#dc3545";
        const icon = micBtn.querySelector("i");
        if (icon) {
          icon.className = audioTrack.enabled
            ? "bi bi-mic-fill"
            : "bi bi-mic-mute-fill";
        }
      }
    });
  }

  // Activar/Desactivar Cámara PC
  if (camBtn) {
    camBtn.addEventListener("click", () => {
      if (!localStream) return;
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        camBtn.style.backgroundColor = videoTrack.enabled ? "" : "#dc3545";
        const icon = camBtn.querySelector("i");
        if (icon) {
          icon.className = videoTrack.enabled
            ? "bi bi-camera-video-fill"
            : "bi bi-camera-video-off-fill";
        }
      }
    });
  }

  // Botón de Colgar en PC
  if (leaveBtn) {
    leaveBtn.addEventListener("click", () => {
      if (currentCall) currentCall.close();
      window.location.reload();
    });
  }
});
