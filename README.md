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


WEEK 4

### Added

- Rebuilt the project as a React + Vite app with component-based architecture.
- Added a Sidebar area with focused child components (`NewChatButton`, `ConversationList`, `ConversationItem`).
- Added a Chat panel area with focused child components (`ChatHeader`, `MessageList`, `MessageItem`, `MessageForm`, `LoadingIndicator`).
- Added a mock API layer under `src/api/`:
  - `conversationsApi.js` with in-memory conversation data and promise-based methods.
  - `messagesApi.js` with in-memory message data and promise-based methods.
  - `llmApi.js` for OpenRouter completion requests (with a local fallback when no key is set).
- Added pre-populated in-memory conversations/messages so the app has initial data on load.
- Added loading indicator while waiting for AI reply.

### Changed

- App state now uses `useState` in `App.jsx` for active conversation + messages.
- Added `useEffect` in sidebar flow for loading conversations on mount.
- Added `useEffect` in app flow for loading messages when active conversation changes.
- Replaced static HTML bootstrapping with React mount (`#root`).
- Added Tailwind via CDN in `index.html`.

### Run

- Local: `npm install` then `npm run dev`
- Build: `npm install` then `npm run build`
- Test: `npm install` then `npm run lint`
