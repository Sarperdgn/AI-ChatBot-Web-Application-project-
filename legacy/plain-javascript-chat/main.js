import { appendUserMessage, createAssistantMessageBubble, clearAllMessages } from './chat.js';
import { streamChatCompletion } from './api.js';

const messages = [];

function setupChat() {
  const formEl = document.getElementById('composer');
  const inputEl = document.getElementById('messageInput');
  const newChatBtn = document.querySelector('.new-chat-btn');
  const conversationButtons = document.querySelectorAll('.conversation-item');
  const headerTitleEl = document.querySelector('.chat-header__title');
  const headerSubtitleEl = document.querySelector('.chat-header__subtitle');

  if (!formEl || !inputEl) return;

  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      clearAllMessages();
      messages.length = 0;
      inputEl.value = '';
      inputEl.focus();

      if (headerTitleEl) {
        headerTitleEl.textContent = 'New Chat';
      }
      if (headerSubtitleEl) {
        headerSubtitleEl.textContent = 'Start a fresh conversation';
      }
    });
  }

  if (conversationButtons.length > 0) {
    conversationButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        conversationButtons.forEach((b) => b.classList.remove('conversation-item--active'));
        btn.classList.add('conversation-item--active');

        const title = btn.querySelector('.conversation-title');
        const preview = btn.querySelector('.conversation-preview');

        if (headerTitleEl && title) {
          headerTitleEl.textContent = title.textContent || '';
        }
        if (headerSubtitleEl && preview) {
          headerSubtitleEl.textContent = preview.textContent || '';
        }

        clearAllMessages();
        messages.length = 0;
      });
    });
  }

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();

    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    inputEl.focus();

    appendUserMessage(text);

    messages.push({ role: 'user', content: text });

    const assistantBubble = createAssistantMessageBubble();
    if (!assistantBubble) return;

    let fullReply = '';

    await streamChatCompletion({
      messages,
      onDelta(delta) {
        fullReply += delta;
        assistantBubble.append(delta);
      },
      onDone() {
        // When the stream ends, store the assistant message in history
        if (fullReply) {
          messages.push({ role: 'assistant', content: fullReply });
        }
      },
      onError(error) {
        assistantBubble.append('\n[Error: failed to reach OpenRouter]');
        console.error(error);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', setupChat);
