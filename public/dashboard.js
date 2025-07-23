document.addEventListener('DOMContentLoaded', async () => {
  const logList = document.getElementById('log-list');

  try {
    const response = await fetch('/dados');
    if (!response.ok) throw new Error('Erro ao buscar dados');

    const dados = await response.json();
    if (!Array.isArray(dados)) throw new Error('Formato inválido');

    dados.forEach(dado => {
      const div = document.createElement('div');
      div.className = 'log-item';
      div.textContent = `${dado.ip} - ${dado.userAgent} - ${dado.localizacao}`;
      logList.appendChild(div);
    });
  } catch (error) {
    logList.textContent = 'Erro ao carregar dados.';
    console.error(error);
  }
});
