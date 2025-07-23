const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para ler dados do body se necessário futuramente
app.use(express.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Caminho para o arquivo onde os dados são armazenados
const filePath = path.join(__dirname, 'coletados.json');

// Endpoint para retornar os dados coletados no dashboard
app.get('/dados', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler coletados.json:', err);
      return res.status(500).json({ erro: 'Erro ao ler dados.' });
    }

    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (parseErr) {
      console.error('Erro ao parsear JSON:', parseErr);
      res.status(500).json({ erro: 'Erro no formato dos dados.' });
    }
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
