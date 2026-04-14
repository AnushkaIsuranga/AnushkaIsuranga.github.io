# API Integrations

## Groq Chatbot API

This portfolio uses Groq from the frontend through the endpoint below:

- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Auth: Bearer token via `VITE_GROQ_API_KEY`
- Location in code: `src/Components/ChatbotWidget.jsx`

## Request Shape

The chatbot sends:

- `model`: `llama-3.3-70b-versatile`
- `messages`: `system` prompt + bounded chat history
- `temperature` and `max_tokens`

## Response Handling

The widget reads the first candidate response:

- `choices[0].message.content`

If the response is empty, rate-limited, unauthorized, or request fails, the UI shows a user-friendly fallback message.

## Security Note

Because this is a frontend-only integration:

- Keep API key private and rotate it if exposed.
- Rotate key if exposed.
- Do not use this approach for sensitive/private data workflows.
