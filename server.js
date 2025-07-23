const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Pasta para uploads
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer para salvar fotos com nome único
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `photo_${timestamp}.jpg`);
  }
});
const upload = multer({ storage });

// Caminho do JSON
const filePath = path.join(__dirname, 'coletados.json');

// GET para dashboard
app.get('/dados', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao ler dados.' });
    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch {
      res.status(500).json({ erro: 'Erro no formato dos dados.' });
    }
  });
});

// POST para salvar dados de coleta
app.post('/coletar', (req, res) => {
  const novoDado = req.body;
  if (!novoDado || !novoDado.ip || !novoDado.userAgent) {
    return res.status(400).json({ erro: 'Dados inválidos.' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    let dados = [];
    if (!err && data) {
      try { dados = JSON.parse(data); } catch {}
    }

    dados.push(novoDado);
    fs.writeFile(filePath, JSON.stringify(dados, null, 2), err => {
      if (err) return res.status(500).json({ erro: 'Erro ao salvar dados.' });
      res.status(201).json({ sucesso: true });
    });
  });
});

// POST para upload da foto
app.post('/upload-photo', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Nenhuma foto enviada.' });
  res.status(200).json({ sucesso: true, path: `/uploads/${req.file.filename}` });
});

// Servir fotos
app.use('/uploads', express.static(uploadFolder));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
