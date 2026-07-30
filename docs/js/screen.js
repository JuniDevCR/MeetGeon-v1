const screenBtn = document.getElementById("screenBtn");

screenBtn.addEventListener("click", shareScreen);

async function shareScreen() {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    localVideo.srcObject = screenStream;

    console.log("Sharing screen");
  } catch (error) {
    console.log(error);
  }
}
