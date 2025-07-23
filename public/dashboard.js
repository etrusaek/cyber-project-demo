document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/logs'); // Rota do backend
    const data = await response.json();

    const logList = document.getElementById('log-list');
    logList.innerHTML = ''; // Limpa antes de adicionar

    if (!data.length) {
      logList.innerHTML = '<p>Nenhum dado coletado ainda.</p>';
      return;
    }

    data.reverse().forEach((log, index) => {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.innerHTML = `
        <p><strong>#${data.length - index}</strong></p>
        <p><strong>IP:</strong> ${log.ip}</p>
        <p><strong>Localização:</strong> ${log.city || 'N/A'}, ${log.region || 'N/A'} - ${log.country || 'N/A'}</p>
        <p><strong>Navegador:</strong> ${log.browser}</p>
        <p><strong>Data:</strong> ${new Date(log.timestamp).toLocaleString()}</p>
        <hr>
      `;
      logList.appendChild(entry);
    });

  } catch (err) {
    console.error('Erro ao buscar dados:', err);
    document.getElementById('log-list').innerHTML = '<p>Erro ao carregar dados.</p>';
  }
});
