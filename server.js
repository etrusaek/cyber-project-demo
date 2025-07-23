const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Rota para retornar os dados coletados
app.get('/dados', (req, res) => {
  const filePath = path.join(__dirname, 'coletados.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler coletados.json:', err.message);
      return res.status(500).json({ erro: 'Erro ao ler os dados.' });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseErr) {
      console.error('Erro ao fazer parse do JSON:', parseErr.message);
      res.status(500).json({ erro: 'Erro ao interpretar os dados.' });
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
