const messages = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let revistaConteudo = "";
let artigos = {}; // Guarda cada artigo individualmente

// Carrega automaticamente todas as páginas HTML da pasta revista
async function carregarPaginasRevista() {
  try {
    const resp = await fetch("/api/listar-revista");
    const ficheiros = await resp.json();

    for (let ficheiro of ficheiros) {
      const respHtml = await fetch(`revista/${ficheiro}`);
      const html = await respHtml.text();

      const temp = document.createElement("div");
      temp.innerHTML = html;

      // REMOVE CSS, JS, META, LINK
      temp.querySelectorAll("style, script, meta, link").forEach(el => el.remove());

      // REMOVE BANNERS OU ELEMENTOS FIXOS
      temp.querySelectorAll(".ad-banner, header, nav, footer").forEach(el => el.remove());

      // Agora extrai só o texto limpo
      const textoLimpo = temp.innerText
        .replace(/\s+/g, " ")
        .trim();

      artigos[ficheiro] = textoLimpo;
      revistaConteudo += textoLimpo + "\n\n";
    }

    addMessage("Revista carregada automaticamente. Já posso responder com base nela.", "bot");

  } catch (e) {
    addMessage("Não consegui carregar as páginas da revista.", "bot");
  }
}


carregarPaginasRevista();

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage("Tu: " + text, "user");

  let resposta = "Procurei na revista mas não encontrei nada sobre isso.";

  const pesquisa = text.toLowerCase();

  // Procura artigo mais relevante
  for (let nome in artigos) {
    if (artigos[nome].toLowerCase().includes(pesquisa)) {
      resposta =
        `Encontrei essa informação no artigo **${nome}**!\n\n` +
        artigos[nome].substring(0, 400) + "...";
      break;
    }
  }

  setTimeout(() => {
    addMessage("RevistaBot: " + resposta, "bot");
  }, 300);

  input.value = "";
});
