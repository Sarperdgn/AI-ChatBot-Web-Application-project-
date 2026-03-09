const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = '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';

export async function streamChatCompletion({ messages, onDelta, onDone, onError }) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Chat UI'
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        stream: true,
        messages
      })
    });

    if (!response.ok || !response.body) {
      throw new Error(`OpenRouter request failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const dataStr = trimmed.slice('data:'.length).trim();
        if (!dataStr || dataStr === '[DONE]') {
          continue;
        }

        try {
          const json = JSON.parse(dataStr);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta && typeof onDelta === 'function') {
            onDelta(delta);
          }
        } catch (error) {
          console.error('Error parsing OpenRouter chunk', error);
        }
      }
    }

    if (typeof onDone === 'function') {
      onDone();
    }
  } catch (error) {
    console.error('OpenRouter streaming error', error);
    if (typeof onError === 'function') {
      onError(error);
    }
  }
}

