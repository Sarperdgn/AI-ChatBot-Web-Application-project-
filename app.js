const messagesEl = document.getElementById('messages');
const formEl = document.getElementById('composer');
const inputEl = document.getElementById('messageInput');

class ChatMessage extends HTMLElement {
  connectedCallback() {
    const sender = this.getAttribute('sender') || 'ai';
    const label = sender === 'user' ? 'You' : 'AI';
    const text = this.textContent?.trim() ?? '';

    this.innerHTML = `
      <div class="bubble">
        <div class="meta">${label}</div>
        <div class="text"></div>
      </div>
    `;

    this.querySelector('.text').textContent = text;
  }
}

customElements.define('chat-message', ChatMessage);

function addMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const message = document.createElement('chat-message');
  message.setAttribute('sender', 'user');
  message.textContent = trimmed;

  messagesEl.appendChild(message);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  addMessage(inputEl.value);
  inputEl.value = '';
  inputEl.focus();
});