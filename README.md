## 🛡️ Cyber Demo – Trackeamento de Dados via Web

> ⚠️ **Este projeto é apenas para fins de demonstração, conscientização e aprendizado. Não deve ser usado em ambientes públicos sem consentimento ou autorização legal.**

 ## 🔍 Funcionalidades

- 📍 Coleta de IP e localização aproximada (via IPInfo)
- 🌐 Detecção de navegador, idioma, resolução de tela e sistema operacional
- 📡 Geolocalização precisa (com permissão do navegador)
- 📸 Acesso à câmera (com permissão) e envio de captura
- 💾 Armazenamento local de dados (`report.json`) e imagens (`uploads/`)
- 🧩 Painel visual (dashboard) para visualização dos dados coletados

 ## 🚀 Como usar

### 1. Clone o repositório

- git clone https://github.com/seu-usuario/cyber-demo.git <br>
- cd cyber-demo

### 2. Instale as dependências

- npm install

### 3. Configure o token do IPInfo

- Crie uma conta gratuita em ipinfo.io
- Copie seu token e substitua no script.js:

fetch("https://ipinfo.io/json?token=SEU_TOKEN_AQUI")

### 4. Inicie o servidor local

- node server.js

### 5. Inicie o servidor local

Página principal: http://localhost:3000 <br>

Painel de visualização: http://localhost:3000/dashboard.html

## 🤞 Outras informações

- 😶‍🌫️**Deploy**: Este projeto pode ser facilmente hospedado em plataformas gratuitas com suporte a Node.js.<br>
- 🔒**Segurança**: Esta aplicação coleta dados sensíveis somente com permissão do usuário final, quando exigido pelo navegador.<br>
- 💻**Licença**: Este projeto é de uso educacional, sem fins lucrativos. Sinta-se livre para estudar, modificar e melhorar — sempre com ética.<br>

Informações do Autor:
- 👨‍💻 Autor : https://github.com/etrusaek
