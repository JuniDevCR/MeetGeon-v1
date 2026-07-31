document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetPeerId = urlParams.get("peer");
  const statusText = document.getElementById("status");
  const remoteVideo = document.getElementById("remoteVideo");

  if (!targetPeerId) {
    statusText.innerText = "Invalid call link.";
    return;
  }

  try {
    // Pedir cámara/micrófono del teléfono
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const peer = new Peer();

    peer.on("open", () => {
      statusText.innerText = "Calling PC...";
      const call = peer.call(targetPeerId, stream);

      call.on("stream", (remoteStream) => {
        statusText.innerText = "Connected to PC!";
        remoteVideo.srcObject = remoteStream;
      });
    });
  } catch (err) {
    console.error(err);
    statusText.innerText = "Camera/Mic access denied.";
  }
});
