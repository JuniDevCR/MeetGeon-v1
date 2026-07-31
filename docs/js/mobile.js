document.addEventListener("DOMContentLoaded", () => {
  const statusText = document.getElementById("status");
  const remoteVideo = document.getElementById("remoteVideo");
  const startBtn = document.getElementById("startBtn");

  // Extraer el id del Peer de la PC desde la URL (?peer=xxxx)
  const urlParams = new URLSearchParams(window.location.search);
  const targetPeerId = urlParams.get("peer");

  if (!targetPeerId) {
    statusText.innerText = "Error: Enlace inválido (sin ID de reunión).";
    if (startBtn) startBtn.style.display = "none";
    return;
  }

  startBtn.addEventListener("click", async () => {
    startBtn.style.display = "none";
    statusText.innerText = "Iniciando cámara y micrófono...";

    try {
      // 1. Obtener la cámara/micrófono del teléfono
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });

      statusText.innerText = "Conectando con el servidor...";

      // 2. Inicializar PeerJS con servidores STUN
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

        // 3. Llamar a la PC enviando la transmisión local del celular
        const call = peer.call(targetPeerId, stream);

        // 4. Recibir el video de la PC
        call.on("stream", (remoteStream) => {
          statusText.innerText = "¡Conectado a la reunión!";
          if (remoteVideo) {
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play();
          }
        });

        call.on("close", () => {
          statusText.innerText = "Llamada finalizada";
        });

        call.on("error", (err) => {
          console.error("Error en la llamada:", err);
          statusText.innerText = "Error de conexión en la llamada";
        });
      });

      peer.on("error", (err) => {
        console.error("Error PeerJS Móvil:", err);
        statusText.innerText = "Error al conectar con la red PeerJS";
      });
    } catch (err) {
      console.error("Error al acceder a los medios:", err);
      statusText.innerText = "Acceso denegado a la cámara o micrófono.";
      startBtn.style.display = "inline-block";
    }
  });
});
