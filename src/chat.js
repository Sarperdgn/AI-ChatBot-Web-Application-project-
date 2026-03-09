const messagesEl = document.getElementById('messages');

class ChatMessage extends HTMLElement {
  connectedCallback() {
    const sender = this.getAttribute('sender') || 'ai';
    const label = sender === 'user' ? 'You' : 'AI';
    const text = (this.textContent || '').trim();

    this.innerHTML = `
      <div class="bubble">
        <div class="meta">${label}</div>
        <div class="text"></div>
      </div>
    `;

    const textEl = this.querySelector('.text');
    if (textEl) textEl.textContent = text;
  }
}

if ('customElements' in window && !window.customElements.get('chat-message')) {
  window.customElements.define('chat-message', ChatMessage);
}

function scrollToBottom() {
  if (!messagesEl) return;
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

export function appendUserMessage(text) {
  if (!messagesEl) return null;

  const message = document.createElement('chat-message');
  message.setAttribute('sender', 'user');
  message.textContent = text;

  messagesEl.appendChild(message);
  scrollToBottom();

  return message;
}

export function createAssistantMessageBubble() {
  if (!messagesEl) return null;

  const message = document.createElement('chat-message');
  message.setAttribute('sender', 'ai');
  message.textContent = '';

  messagesEl.appendChild(message);
  scrollToBottom();

  const textEl = message.querySelector('.text');

  return {
    element: message,
    append(delta) {
      if (!delta || !textEl) return;
      textEl.textContent += delta;
      scrollToBottom();
    }
  };
}

export function clearAllMessages() {
  if (!messagesEl) return;
  messagesEl.innerHTML = '';
}


