const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // certifique-se de que está instalado
const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota para coletar dados
app.get('/coletar', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  let localizacao = 'Desconhecida';

  try {
    const resposta = await fetch(`https://ipapi.co/${ip}/json/`);
    const dadosGeo = await resposta.json();
    if (dadosGeo && dadosGeo.city && dadosGeo.country) {
      localizacao = `${dadosGeo.city}, ${dadosGeo.country}`;
    }
  } catch (err) {
    console.error('Erro ao obter localização:', err.message);
  }

  const novoDado = {
    ip,
    userAgent,
    localizacao
  };

  const arquivo = path.join(__dirname, 'coletados.json');
  let dadosAtuais = [];

  try {
    if (fs.existsSync(arquivo)) {
      const conteudo = fs.readFileSync(arquivo, 'utf-8');
      dadosAtuais = JSON.parse(conteudo);
    }
  } catch (err) {
    console.error('Erro ao ler arquivo:', err.message);
  }

  dadosAtuais.push(novoDado);

  try {
    fs.writeFileSync(arquivo, JSON.stringify(dadosAtuais, null, 2));
  } catch (err) {
    console.error('Erro ao salvar dados:', err.message);
  }

  res.sendStatus(200);
});

// Rota para fornecer os dados para a dashboard
app.get('/dados', (req, res) => {
  const arquivo = path.join(__dirname, 'coletados.json');
  try {
    if (fs.existsSync(arquivo)) {
      const conteudo = fs.readFileSync(arquivo, 'utf-8');
      const dados = JSON.parse(conteudo);
      res.json(dados);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('Erro ao ler dados:', err.message);
    res.status(500).send('Erro ao ler dados.');
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
