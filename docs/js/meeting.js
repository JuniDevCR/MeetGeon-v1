document.addEventListener("DOMContentLoaded", async () => {
  const remoteVideo = document.getElementById("remoteVideo");
  const localVideo = document.getElementById("localVideo");
  const qrContainer = document.getElementById("qr-container");
  const statusTitle = document.getElementById("status-title");
  const mobileStatus = document.getElementById("mobile-status");

  let localStream = null;

  // 1. Obtener la cámara local de la PC
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideo) {
      localVideo.srcObject = localStream;
    }
  } catch (err) {
    console.error("No se pudo acceder a la cámara o micrófono de la PC:", err);
    if (statusTitle)
      statusTitle.innerText = "Error: Por favor concede permisos de cámara";
  }

  // 2. Inicializar PeerJS con servidores STUN de Google
  const peer = new Peer({
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    },
  });

  peer.on("open", (peerId) => {
    console.log("PC Peer ID generado:", peerId);

    // Detecta la URL base exacta de GitHub Pages (o entorno local)
    const currentFolder = window.location.href.substring(
      0,
      window.location.href.lastIndexOf("/"),
    );
    const callUrl = `${currentFolder}/mobile.html?peer=${peerId}`;

    console.log("URL codificada en el QR:", callUrl);

    // Limpiar y dibujar el código QR
    if (qrContainer) {
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, {
        text: callUrl,
        width: 180,
        height: 180,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  });

  // 3. Responder cuando el celular realice la llamada
  peer.on("call", (call) => {
    if (statusTitle)
      statusTitle.innerText = "Conectando con el dispositivo móvil...";

    // Responder enviando la señal de video/audio de la PC
    call.answer(localStream);

    // Recibir la señal de video/audio del teléfono
    call.on("stream", (remoteStream) => {
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
        remoteVideo.play();
      }
      if (statusTitle) statusTitle.innerText = "¡Participante conectado!";
      if (mobileStatus) mobileStatus.innerText = "Conectado";
      if (qrContainer) qrContainer.style.display = "none"; // Ocultar el QR tras conectar
    });

    call.on("close", () => {
      if (statusTitle) statusTitle.innerText = "Participante desconectado";
      if (mobileStatus) mobileStatus.innerText = "Desconectado";
    });

    call.on("error", (err) => {
      console.error("Error en la llamada:", err);
      if (statusTitle) statusTitle.innerText = "Error en la conexión";
    });
  });

  peer.on("error", (err) => {
    console.error("Error en el Peer de la PC:", err);
  });
});
