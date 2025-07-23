// Faz requisição GET para o servidor buscando os dados coletados
fetch('/dados')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('log-list');

    // Verifica se há dados
    if (!data || data.length === 0) {
      container.innerHTML = '<p>Nenhum dado coletado ainda.</p>';
      return;
    }

    // Para cada item, cria uma "caixa" de exibição
    data.forEach(item => {
      const div = document.createElement('div');
      div.className = 'log-item';
      div.innerHTML = `
        <p><strong>IP:</strong> ${item.ip || 'Desconhecido'}</p>
        <p><strong>Localização:</strong> ${item.localizacao || 'N/A'}</p>
        <p><strong>Navegador:</strong> ${item.navegador || 'N/A'}</p>
        <p><strong>Plataforma:</strong> ${item.sistema || 'N/A'}</p>
        <p><strong>Horário:</strong> ${item.timestamp || 'N/A'}</p>
        <hr>
      `;
      container.appendChild(div);
    });
  })
  .catch(error => {
    console.error('Erro ao carregar dados:', error);
    const container = document.getElementById('log-list');
    container.innerHTML = '<p>Erro ao carregar os dados.</p>';
  });
