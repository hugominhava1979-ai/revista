// server.js

// Importa módulos necessários
const express = require('express'); // Framework web para criar o servidor HTTP
const fs = require('fs'); // Para ler ficheiros do sistema
const path = require('path'); // Para lidar com caminhos de ficheiros
const cheerio = require('cheerio'); // Para extrair texto dos ficheiros HTML

const app = express();
const PORT = process.env.PORT || 3000;

// Pasta onde estão as páginas da revista
const REVISTA_DIR = path.join(__dirname, 'revista');

// Middleware para servir ficheiros estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para interpretar JSON no body das requisições
app.use(express.json());

// Estrutura em memória para guardar o conteúdo das páginas
let artigos = [];

/**
 * Função para carregar todos os ficheiros HTML da pasta revista/
 * e extrair o texto para pesquisa.
 */
function carregarArtigos() {
  artigos = []; // limpa array

  // Lê todos os ficheiros da pasta revista
  const ficheiros = fs.readdirSync(REVISTA_DIR);

  ficheiros.forEach((ficheiro) => {
    // Considera apenas ficheiros .html
    if (ficheiro.endsWith('.html')) {
      const filePath = path.join(REVISTA_DIR, ficheiro);

      // Lê o conteúdo do ficheiro
      const html = fs.readFileSync(filePath, 'utf-8');

      // Usa cheerio para carregar o HTML
      const $ = cheerio.load(html);

      // Extrai o texto principal (aqui usamos todo o texto do body)
      const texto = $('body').text().replace(/\s+/g, ' ').trim();

      // Guarda o artigo em memória
      artigos.push({
        nomeFicheiro: ficheiro,
        caminho: filePath,
        texto,
      });
    }
  });

  console.log(`Carregados ${artigos.length} artigos da revista.`);
}

// Carrega os artigos ao iniciar o servidor
carregarArtigos();

/**
 * Função simples de "chatbot":
 * - Recebe uma pergunta
 * - Faz uma pesquisa por palavras-chave no texto dos artigos
 * - Devolve o excerto mais relevante encontrado
 */
function responderPergunta(pergunta) {
  if (!pergunta || pergunta.trim().length === 0) {
    return 'Por favor, escreve uma pergunta.';
  }

  const query = pergunta.toLowerCase();

  let melhorArtigo = null;
  let melhorScore = 0;
  let melhorExcerto = '';

  // Percorre todos os artigos para encontrar o melhor "match"
  artigos.forEach((artigo) => {
    const textoLower = artigo.texto.toLowerCase();

    // Conta quantas vezes as palavras da pergunta aparecem no texto
    const palavras = query.split(' ').filter((p) => p.length > 2);
    let score = 0;

    palavras.forEach((palavra) => {
      if (textoLower.includes(palavra)) {
        score += 1;
      }
    });

    // Se este artigo tiver mais "matches", torna-se o melhor
    if (score > melhorScore) {
      melhorScore = score;

      // Encontra a primeira ocorrência da primeira palavra
      const primeiraPalavra = palavras[0];
      const idx = textoLower.indexOf(primeiraPalavra);

      if (idx !== -1) {
        // Cria um excerto em torno da posição encontrada
        const inicio = Math.max(0, idx - 120);
        const fim = Math.min(artigo.texto.length, idx + 280);
        melhorExcerto = artigo.texto.substring(inicio, fim) + '...';
      } else {
        // Se não encontrar, usa o início do texto
        melhorExcerto = artigo.texto.substring(0, 300) + '...';
      }

      melhorArtigo = artigo;
    }
  });

  // Se não encontrou nada relevante
  if (!melhorArtigo || melhorScore === 0) {
    return 'Não encontrei nada diretamente relacionado à tua pergunta nos artigos da revista.';
  }

  // Monta uma resposta simples com referência ao ficheiro
  return (
    `Encontrei algo relacionado na página "${melhorArtigo.nomeFicheiro}":\n\n` +
    melhorExcerto
  );
}

// Endpoint de API para o chatbot
app.post('/api/chat', (req, res) => {
  // Lê a pergunta enviada pelo frontend
  const { pergunta } = req.body;

  // Gera a resposta
  const resposta = responderPergunta(pergunta);

  // Devolve em JSON
  res.json({ resposta });
});

// Endpoint opcional para recarregar artigos sem reiniciar o servidor
app.post('/api/recarregar', (req, res) => {
  carregarArtigos();
  res.json({ status: 'ok', mensagem: 'Artigos recarregados.' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
