const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const filePath = path.join(__dirname, 'coletados.json');

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

app.post('/coletar', (req, res) => {
  const novoDado = req.body;

  if (!novoDado || !novoDado.ip || !novoDado.userAgent) {
    return res.status(400).json({ erro: 'Dados inválidos.' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    let dados = [];
    if (!err && data) {
      try {
        dados = JSON.parse(data);
      } catch (parseErr) {
        console.error('Erro ao parsear coletados.json:', parseErr);
      }
    }

    dados.push(novoDado);

    fs.writeFile(filePath, JSON.stringify(dados, null, 2), writeErr => {
      if (writeErr) {
        console.error('Erro ao salvar dados:', writeErr);
        return res.status(500).json({ erro: 'Erro ao salvar dados.' });
      }

      res.status(201).json({ sucesso: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
