async function loadLogs() {
  const res = await fetch("/logs");
  const logs = await res.json();
  const container = document.getElementById("log-list");
  container.innerHTML = "";

  logs.reverse().forEach((log, index) => {
    const div = document.createElement("div");
    div.classList.add("log-entry");

    div.innerHTML = `
      <h3>#${logs.length - index} — ${new Date(log.timestamp).toLocaleString()}</h3>
      <p><strong>IP:</strong> ${log.ip || "N/A"} | ${log.city || ""} - ${log.region || ""} (${log.country || ""})</p>
      <p><strong>Coordenadas:</strong> ${log.loc || "N/A"}</p>
      ${log.preciseLocation ? `<p><strong>Preciso:</strong> ${log.preciseLocation.latitude}, ${log.preciseLocation.longitude}</p>` : ""}
      <p><strong>Dispositivo:</strong> ${log.userAgent}</p>
      <p><strong>Idioma:</strong> ${log.language}</p>
      <p><strong>Resolução:</strong> ${log.screenResolution}</p>
      <hr>
    `;
    container.appendChild(div);
  });
}

loadLogs();
