const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const boca = document.querySelector('.boca');
const olhos = document.querySelectorAll('.olho');

/* Mascote reage quando o bot fala */
function mascoteFala() {
  boca.style.height = '20px';
  boca.style.background = '#00ffcc';

  setTimeout(() => {
    boca.style.height = '10px';
    boca.style.background = '#00aaff';
  }, 800);
}

/* Adiciona mensagens ao chat */
function adicionarMensagem(texto, tipo) {
  const msg = document.createElement('div');
  msg.classList.add('message', tipo);
  msg.textContent = texto;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/* Envia pergunta ao backend */
async function enviarPergunta() {
  const pergunta = userInput.value.trim();
  if (!pergunta) return;

  adicionarMensagem(pergunta, 'user');
  userInput.value = '';

  try {
    const resposta = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta }),
    });

    const data = await resposta.json();

    // Tom divertido
    const respostaDivertida =
      '😄 *Beep bop!* Aqui vai o que encontrei para ti:\n\n' + data.resposta;

    adicionarMensagem(respostaDivertida, 'bot');
    mascoteFala();
  } catch (erro) {
    adicionarMensagem('Ups! Algo deu o tilt no meu cérebro robótico!', 'bot');
  }
}

sendBtn.addEventListener('click', enviarPergunta);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') enviarPergunta();
});
