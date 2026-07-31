let localStream = null;

// Obtener elementos
const localVideo = document.getElementById("localVideo");

// Iniciar cámara
async function startCamera() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideo.srcObject = localStream;

    console.log("Camera started");
  } catch (error) {
    console.error("Camera error:", error);
  }
}
