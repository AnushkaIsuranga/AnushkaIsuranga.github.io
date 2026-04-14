# API Integrations

## Gemini Chatbot API

This portfolio uses Google Gemini from the frontend through the endpoint below:

- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- Auth: API key via `VITE_GEMINI_API_KEY`
- Location in code: `src/Components/ChatbotWidget.jsx`

## Request Shape

The chatbot sends:

- `system_instruction`: Context generated from portfolio content
- `contents`: Recent chat history (bounded to prevent oversized payloads)
- `generationConfig`: `temperature` and `maxOutputTokens`

## Response Handling

The widget reads the first candidate response:

- `candidates[0].content.parts[0].text`

If the response is empty, rate-limited, or request fails, the UI shows a user-friendly fallback message.

## Security Note

Because this is a frontend-only integration:

- Restrict API key by website referrer in Google Cloud Console.
- Rotate key if exposed.
- Do not use this approach for sensitive/private data workflows.
