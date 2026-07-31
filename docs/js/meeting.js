document.addEventListener("DOMContentLoaded", async () => {
  const remoteVideo = document.getElementById("remoteVideo");
  const localVideo = document.getElementById("localVideo");
  const qrContainer = document.getElementById("qr-container");
  const statusTitle = document.getElementById("status-title");
  const mobileStatus = document.getElementById("mobile-status");

  let localStream = null;

  // 1. Obtener la cámara local si no la ha iniciado camera.js
  try {
    if (localVideo && !localVideo.srcObject) {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideo.srcObject = localStream;
    } else if (localVideo && localVideo.srcObject) {
      localStream = localVideo.srcObject;
    }
  } catch (err) {
    console.error("No se pudo acceder a la cámara/micrófono de la PC:", err);
  }

  // 2. Inicializar PeerJS
  const peer = new Peer();

  peer.on("open", async (peerId) => {
    console.log("PC Peer ID:", peerId);

    // Obtener IP del servidor Node
    let baseUrl = window.location.origin;
    try {
      const res = await fetch("/api/config");
      const config = await res.json();
      baseUrl = config.baseUrl;
    } catch (e) {
      console.warn("No se pudo obtener /api/config, usando origin actual");
    }

    // Construir URL a la que entrará el celular (ej. /mobile.html?peer=XYZ)
    const callUrl = `${baseUrl}/mobile.html?peer=${peerId}`;

    // Limpiar y dibujar el código QR
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
      text: callUrl,
      width: 180,
      height: 180,
    });
  });

  // 3. Responder la llamada cuando el celular se conecte
  peer.on("call", (call) => {
    if (statusTitle) statusTitle.innerText = "Connecting with mobile...";

    // Responder enviando la transmisión de la PC (video/audio)
    call.answer(localStream);

    // Recibir la transmisión del celular
    call.on("stream", (remoteStream) => {
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
      }
      if (statusTitle) statusTitle.innerText = "Connected!";
      if (mobileStatus) mobileStatus.innerText = "Connected";
      if (qrContainer) qrContainer.style.display = "none"; // Ocultar el QR una vez conectados
    });

    call.on("close", () => {
      if (statusTitle) statusTitle.innerText = "Participant disconnected";
      if (mobileStatus) mobileStatus.innerText = "Disconnected";
    });
  });
});
