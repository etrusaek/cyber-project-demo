document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/dados");
    const dados = await res.json();
    const container = document.getElementById("log-list");

    dados.reverse().forEach((dado, index) => {
      const div = document.createElement("div");
      div.classList.add("card");

      const ip = dado.ip || "N/A";
      const ua = dado.userAgent || "N/A";
      const city = dado.city || "N/A";
      const region = dado.region || "N/A";
      const country = dado.country || "N/A";
      const resolution = dado.screenResolution || "N/A";
      const timestamp = dado.timestamp || "Data não registrada";

      div.innerHTML = `
        <p><strong>IP:</strong> ${ip}</p>
        <p><strong>Navegador:</strong> ${ua}</p>
        <p><strong>Localização:</strong> ${city}, ${region}, ${country}</p>
        <p><strong>Resolução:</strong> ${resolution}</p>
        <p><strong>Data/Hora:</strong> ${timestamp}</p>
      `;

      // se quiser mostrar a imagem associada (opcional)
      // você precisaria salvar o nome da imagem no JSON também
      // exemplo abaixo, assumindo que foi salvo como dado.photoFileName
      if (dado.photoFileName) {
        const img = document.createElement("img");
        img.src = `/uploads/${dado.photoFileName}`;
        img.alt = "Foto do visitante";
        div.appendChild(img);
      }

      container.appendChild(div);
    });
  } catch (e) {
    console.error("Erro ao carregar dados:", e);
    document.getElementById("log-list").textContent = "Erro ao carregar os dados.";
  }
});
