const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Coleta de dados
app.post('/coletar', async (req, res) => {
  try {
    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    const ipReal = ip.includes('::ffff:') ? ip.split('::ffff:')[1] : ip;

    // Coleta localização via IP
    const response = await axios.get(`http://ip-api.com/json/${ipReal}`);
    const { city, regionName: region, country } = response.data;

    const userAgent = req.headers['user-agent'] || 'N/A';
    const browser = userAgent.includes('Chrome')
      ? 'Chrome'
      : userAgent.includes('Firefox')
      ? 'Firefox'
      : userAgent.includes('Safari')
      ? 'Safari'
      : 'Desconhecido';

    const dados = {
      ip: ipReal,
      city,
      region,
      country,
      browser,
      timestamp: new Date().toISOString(),
    };

    const filePath = path.join(__dirname, 'coletados.json');

    let logs = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      logs = raw ? JSON.parse(raw) : [];
    }

    logs.push(dados);

    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

    res.status(200).json({ mensagem: 'Dados coletados com sucesso.' });
  } catch (error) {
    console.error('Erro na coleta:', error.message);
    res.status(500).json({ erro: 'Erro ao coletar dados.' });
  }
});

// Rota para retornar os dados coletados
app.get('/logs', (req, res) => {
  const filePath = path.join(__dirname, 'coletados.json');

  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao ler dados' });
    const logs = data ? JSON.parse(data) : [];
    res.json(logs);
  });
});

// Início do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
