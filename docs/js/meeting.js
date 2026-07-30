const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let localStream;

async function startCamera() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideo.srcObject = localStream;
  } catch (err) {
    console.error(err);
    alert("Camera permission denied.");
  }
}

startCamera();
