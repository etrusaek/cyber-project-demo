const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Permite servir arquivos estáticos (index.html, style.css, script.js, imagens...)
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal (caso alguém acesse apenas "/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota opcional para painel, se quiser usar /dashboard ou algo assim
// app.get('/dashboard', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
// });

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
