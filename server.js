import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Corrigir __dirname no ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota para obter dados coletados
app.get('/dados', (req, res) => {
  const filePath = path.join(__dirname, 'coletados.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo coletados.json:', err);
      return res.status(500).json({ error: 'Erro ao ler os dados.' });
    }

    try {
      const logs = JSON.parse(data);
      res.json(logs);
    } catch (parseError) {
      console.error('Erro ao parsear o JSON:', parseError);
      res.status(500).json({ error: 'Erro ao processar os dados.' });
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
