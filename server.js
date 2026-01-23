const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Servir todos os ficheiros estáticos da raiz (index.html, style.css, script.js, etc.)
app.use(express.static(path.join(__dirname)));

// Servir a pasta "revista" (onde estão os artigos HTML)
app.use("/revista", express.static(path.join(__dirname, "revista")));

// Endpoint que devolve a lista de ficheiros HTML dentro da pasta revista
app.get("/api/listar-revista", (req, res) => {
  const pasta = path.join(__dirname, "revista");

  fs.readdir(pasta, (err, files) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao ler a pasta revista" });
    }

    const htmlFiles = files.filter(f => f.toLowerCase().endsWith(".html"));
    res.json(htmlFiles);
  });
});

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
