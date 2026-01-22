const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const olhos = document.querySelectorAll('.olho');
const boca = document.querySelector('.boca');

/* Tipos de “estado emocional” do bot */
function setOlhos(cor, brilho = true) {
  olhos.forEach(o => {
    o.style.background = cor;
    o.style.boxShadow = brilho ? `0 0 12px ${cor}` : 'none';
  });
}

function botFeliz() {
  setOlhos('#00ffcc');
  boca.style.height = '14%';
  boca.style.borderRadius = '20px';
}

function botNeutro() {
  setOlhos('#00aaff');
  boca.style.height = '10%';
  boca.style.borderRadius = '20px';
}

function botConfuso() {
  setOlhos('#ffcc00');
  boca.style.height = '6%';
  boca.style.borderRadius = '50px';
}

function botTriste() {
  setOlhos('#ff3366');
  boca.style.height = '6%';
  boca.style.borderRadius = '50px';
}

/* Pequena animação quando fala */
function mascoteFala() {
  boca.style.transform = 'scaleY(1.3)';
  setTimeout(() => {
    boca.style.transform = 'scaleY(1)';
  }, 300);
}

/* Adiciona mensagens ao chat */
function adicionarMensagem(texto, tipo) {
  const msg = document.createElement('div');
  msg.classList.add('message', tipo);
  msg.textContent = texto;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/* Classificação simples do “tom” da resposta */
function classificarResposta(texto) {
  const t = texto.toLowerCase();
  if (t.includes('não encontrei') || t.includes('erro')) return 'triste';
  if (t.includes('encontrei') || t.includes('aqui vai')) return 'feliz';
  return 'neutro';
}

/* Envia pergunta ao backend */
async function enviarPergunta() {
  const pergunta = userInput.value.trim();
  if (!pergunta) return;

  adicionarMensagem(pergunta, 'user');
  userInput.value = '';
  botNeutro();

  try {
    const resposta = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta })
    });

    const data = await resposta.json();

    const respostaDivertida =
      '😄 *Beep bop!* Aqui vai o que encontrei para ti:\n\n' +
      data.resposta;

    adicionarMensagem(respostaDivertida, 'bot');

    const estado = classificarResposta(data.resposta);
    if (estado === 'feliz') botFeliz();
    else if (estado === 'triste') botTriste();
    else botNeutro();

    mascoteFala();
  } catch (erro) {
    adicionarMensagem(
      'Ups! Algo deu o tilt no meu cérebro robótico! 🤯',
      'bot'
    );
    botTriste();
  }
}

sendBtn.addEventListener('click', enviarPergunta);
userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') enviarPergunta();
});

/* Estado inicial */
botNeutro();
