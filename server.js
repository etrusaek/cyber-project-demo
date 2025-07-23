const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// ✅ Rota para fornecer os dados coletados
app.get('/dados', (req, res) => {
  fs.readFile(path.join(__dirname, 'coletados.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler coletados.json:', err);
      return res.status(500).json({ erro: 'Erro ao ler os dados.' });
    }
    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (e) {
      console.error('JSON inválido em coletados.json:', e);
      res.status(500).json({ erro: 'Formato inválido.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
