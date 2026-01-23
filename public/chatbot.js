const messages = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (text === "") return;

  addMessage("Tu: " + text, "user");

  setTimeout(() => {
    addMessage("RevistaBot: Ainda estou a aprender, mas adoro conversar contigo!", "bot");
  }, 500);

  input.value = "";
});
