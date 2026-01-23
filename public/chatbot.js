const messages = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const loadBtn = document.getElementById("load-revista-btn");

let revistaConteudo = ""; // aqui fica guardado o texto das páginas

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// Carrega todas as páginas da pasta revista
async function carregarRevista() {
  const paginas = ["pagina1.html", "pagina2.html"]; // adiciona mais se quiseres

  revistaConteudo = "";

  for (let p of paginas) {
    try {
      const resp = await fetch(`revista/${p}`);
      const html = await resp.text();

      // extrai apenas texto
      const temp = document.createElement("div");
      temp.innerHTML = html;
      revistaConteudo += temp.innerText + "\n\n";

    } catch (e) {
      console.log("Erro ao carregar página:", p);
    }
  }

  addMessage("Revista carregada! Já posso responder com base nela.", "bot");
}

loadBtn.addEventListener("click", carregarRevista);

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage("Tu: " + text, "user");

  let resposta = "Ainda não carregaste a revista.";

  if (revistaConteudo.length > 0) {
    // resposta baseada no conteúdo
    if (revistaConteudo.toLowerCase().includes(text.toLowerCase())) {
      resposta = "Encontrei essa informação na revista! Aqui vai um resumo:\n\n" +
                 revistaConteudo.substring(0, 300) + "...";
    } else {
      resposta = "Procurei na revista mas não encontrei nada sobre isso.";
    }
  }

  setTimeout(() => {
    addMessage("RevistaBot: " + resposta, "bot");
  }, 400);

  input.value = "";
});
