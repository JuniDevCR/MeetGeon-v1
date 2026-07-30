const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

if (!localVideo || !remoteVideo) {
  console.error("No se encontraron los videos.");
} else {
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideo.srcObject = stream;
    } catch (err) {
      console.error(err);
    }
  }

  startCamera();
}
