WEEK 2

### Added

- Two-column layout (sidebar + main chat area)
- Sidebar with:
  - "New Chat" button
  - Multiple conversations
  - Active conversation styling
- Scrollable message list
- Pinned input bar at the bottom
- Textarea input field
- Alternating message alignment (AI left, User right)

### Changed

- Refactored message rendering to use custom element instead of plain divs
- Updated CSS to support new layout structure

---

WEEK 3

### Added

- Split JavaScript into ES modules:
  - `main.js` for app entry and event listeners
  - `chat.js` for DOM manipulation and custom `chat-message` element
  - `api.js` for OpenRouter fetch + streaming logic
- Streaming chat integration with `https://openrouter.ai/api/v1/chat/completions`:
  - Sends full `messages` history with `stream: true`
  - Reads SSE chunks with `ReadableStream` + `TextDecoder`
  - Appends AI reply to the assistant bubble as deltas arrive
- Conversation state:
  - Maintains `messages` array across turns
  - Pushes full assistant reply into history after each streamed response
- Sidebar behavior:
  - `New Chat` button clears messages and resets history
  - Sidebar items toggle active state, update header, and start a fresh thread

### Changed

- Removed hard‑coded sample messages from HTML; all bubbles are now rendered dynamically from JavaScript
- Cleaned most inline comments from source files while keeping behavior unchanged
