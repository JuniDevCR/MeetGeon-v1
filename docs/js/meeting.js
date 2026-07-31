document.addEventListener("DOMContentLoaded", async () => {
  const remoteVideo = document.getElementById("remoteVideo");
  const localVideo = document.getElementById("localVideo");
  const qrContainer = document.getElementById("qr-container");
  const statusTitle = document.getElementById("status-title");
  const mobileStatus = document.getElementById("mobile-status");

  let localStream = null;

  // 1. Iniciar cámara local de la PC
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideo) localVideo.srcObject = localStream;
  } catch (err) {
    console.error("No se pudo acceder a la cámara/micrófono de la PC:", err);
  }

  // 2. Inicializar PeerJS (Usa los servidores gratuitos de PeerJS en la nube)
  const peer = new Peer();

  peer.on("open", (peerId) => {
    console.log("PC Peer ID:", peerId);

    // Generar la URL apuntando a la dirección real de GitHub Pages
    // Detecta automáticamente si estás en github.io o probando localmente
    const currentUrl = window.location.href.substring(
      0,
      window.location.href.lastIndexOf("/"),
    );
    const callUrl = `${currentUrl}/mobile.html?peer=${peerId}`;

    console.log("URL del QR:", callUrl);

    // Limpiar y dibujar el QR
    if (qrContainer) {
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, {
        text: callUrl,
        width: 180,
        height: 180,
      });
    }
  });

  // 3. Esperar la llamada entrante del celular
  peer.on("call", (call) => {
    if (statusTitle) statusTitle.innerText = "Connecting with mobile...";

    // Responder enviando el audio/video de la PC
    call.answer(localStream);

    // Recibir el audio/video del celular
    call.on("stream", (remoteStream) => {
      if (remoteVideo) remoteVideo.srcObject = remoteStream;
      if (statusTitle) statusTitle.innerText = "Connected!";
      if (mobileStatus) mobileStatus.innerText = "Connected";
      if (qrContainer) qrContainer.style.display = "none"; // Ocultar QR al conectar
    });

    call.on("close", () => {
      if (statusTitle) statusTitle.innerText = "Participant disconnected";
      if (mobileStatus) mobileStatus.innerText = "Disconnected";
    });
  });
});
