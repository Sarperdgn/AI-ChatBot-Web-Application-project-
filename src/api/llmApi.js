const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function requestAssistantCompletion(messages) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    const fallbackText = lastUserMessage
      ? `Mock reply: I saw your message: "${lastUserMessage.content}". Add VITE_OPENROUTER_API_KEY to use OpenRouter.`
      : 'Mock reply: configure VITE_OPENROUTER_API_KEY to enable OpenRouter responses.';

    return { role: 'assistant', content: fallbackText };
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'React Chat UI'
    },
    body: JSON.stringify({
      model: 'openrouter/auto',
      messages: messages.map((message) => ({ role: message.role, content: message.content }))
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content?.trim() || 'No response returned.';

  return { role: 'assistant', content };
}
