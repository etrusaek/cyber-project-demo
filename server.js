const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Servir imagens da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Caminho do arquivo onde os dados são armazenados
const filePath = path.join(__dirname, 'coletados.json');

// Garante que a pasta "uploads" exista
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuração do multer para upload de imagem
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Rota para exibir os dados no dashboard
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

// Rota para receber os dados coletados (JSON)
app.post('/coletar', (req, res) => {
  const novoDado = req.body;

  if (!novoDado || !novoDado.ip || !novoDado.userAgent) {
    return res.status(400).json({ erro: 'Dados inválidos.' });
  }

  novoDado.timestamp = new Date().toISOString();

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

// Rota para upload da foto
app.post('/upload-photo', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhuma foto enviada.');
  }

  const filename = req.file.filename;

  // Atualiza o último registro com o nome da foto
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler coletados.json:', err);
      return res.status(500).send('Erro ao ler dados.');
    }

    try {
      const json = JSON.parse(data);
      const last = json[json.length - 1];
      if (last) {
        last.photoFileName = filename;
        fs.writeFile(filePath, JSON.stringify(json, null, 2), (err) => {
          if (err) {
            console.error('Erro ao salvar imagem:', err);
            return res.status(500).send('Erro ao salvar imagem.');
          }
          console.log('📸 Foto salva como:', filename);
          res.send('Foto recebida com sucesso.');
        });
      } else {
        res.status(200).send('Foto recebida, mas sem dados para associar.');
      }
    } catch (parseErr) {
      console.error('Erro ao processar JSON:', parseErr);
      res.status(500).send('Erro ao processar dados.');
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
