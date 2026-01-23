const messages = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let revistaConteudo = "";

// Carrega automaticamente todas as páginas HTML da pasta revista
async function carregarPaginasRevista() {
  try {
    const lista = await fetch("revista/");
    const texto = await lista.text();

    // Extrai nomes de ficheiros .html
    const matches = [...texto.matchAll(/href="([^"]+\.html)"/g)];

    for (let m of matches) {
      const ficheiro = m[1];
      const resp = await fetch(`revista/${ficheiro}`);
      const html = await resp.text();

      const temp = document.createElement("div");
      temp.innerHTML = html;
      revistaConteudo += temp.innerText + "\n\n";
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

  if (revistaConteudo.toLowerCase().includes(text.toLowerCase())) {
    resposta = "Encontrei essa informação na revista! Aqui vai um resumo:\n\n" +
               revistaConteudo.substring(0, 300) + "...";
  }

  setTimeout(() => {
    addMessage("RevistaBot: " + resposta, "bot");
  }, 400);

  input.value = "";
});
