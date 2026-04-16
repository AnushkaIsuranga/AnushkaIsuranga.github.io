# API Integrations

## Groq Chatbot API

This portfolio chatbot calls Groq directly from the frontend.

- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Location in code: `src/Components/ChatbotWidget.jsx`
- Auth: Bearer token via `VITE_GROQ_API_KEY`

## Request Shape

The chatbot sends:

- `model`: `llama-3.3-70b-versatile`
- `messages`: isolated system instructions + assistant knowledge context + recent chat history + current user message
- `temperature` and `max_tokens`

## Knowledge Base Layer

The chatbot uses a structured in-app knowledge base to build the system prompt context.

- Module: `src/Chatbot/KnowledgeBase.js`
- Query router: `src/Chatbot/queryRouter.js`
- Consumer: `src/Components/ChatbotWidget.jsx`
- Prompt behavior: frontend builds query-aware prompt context from selected knowledge entries.
- Experience-duration prompts (for example, years/how long/since when) are routed to the `experience` intent.

### Knowledge Base Exports

- `knowledgeBase`: full object payload with version, generated timestamp, collections, and entries.
- `knowledgeBaseEntries`: flattened list of all normalized knowledge entries.
- `getKnowledgeEntries(options)`: queryable accessor with category, visibility, text filtering, and limit.
- `retrieveKnowledge(options)`: semantic-style retrieval with token expansion and relevance scoring, with a larger candidate pool for broad general queries.
- `isPortfolioQuestion(query)`: domain-intent helper.
- `getKnowledgeContext(options)`: prompt-friendly bullet list built from selected entries (full `content` is included for `experience`, `project`, `certification`, and `achievement` entries for richer inference context).
- `legacyKnowledgeBase`: compatibility array in `{ type, text }` format.

### Entry Shape

Each knowledge entry is normalized into:

- `id`
- `category`
- `subcategory`
- `title`
- `summary` (includes stack/tool highlights for skills/projects)
- `content`
- `tags`
- `keywords`
- `source`
- `visibility` (`public` or `private`)
- `searchableText`

Collections currently generated:

- profile
- skills
- experiences
- projects
- certifications
- achievements
- contact

## Semantic Retrieval

Retrieval now uses two stages:

- Stage 1: lightweight semantic scoring from `retrieveKnowledge()` (token expansion + relevance ranking).
- Stage 2: optional future embedding rerank (not currently enabled in frontend-only mode).

## Query-Aware Routing

Before calling Groq, the widget detects query intent and narrows retrieval categories.

- `detectQueryType(question)` classifies the question intent.
- `resolveCategoriesForQuery(type)` maps intent to relevant knowledge categories.
- Context injection limits are smaller and dynamic (`8` or `10` entries based on query type).

This reduces token usage and improves answer relevance.

## Instruction Isolation

The request now isolates instructions and retrieved context into separate message roles:

- `system`: strict safety and scope rules only.
- `assistant`: retrieved portfolio context block.
- `history`: only the most recent 3 messages.
- `user`: current question.

This reduces instruction/context confusion and improves prompt-injection resistance.

## Response Handling

The widget reads:

- `choices[0].message.content`

Assistant replies are rendered in the UI with `react-markdown`, so ordered and unordered lists, bold labels, inline code, links, and fenced code blocks display with formatting instead of plain text.

The chat view auto-scrolls to the newest message while replies stream in.

If the response is empty, rate-limited, unauthorized, or request fails, the UI shows a user-friendly fallback message.

The widget also includes a small 1.5 second response delay effect to make the assistant feel less abrupt.

## Guardrails and Security

Prompt constraints are applied in `src/Components/ChatbotWidget.jsx` system prompt.

- Translation requests are blocked before reaching Groq.
- The widget returns a fixed refusal for translation prompts instead of translating text.
- Prompt injection hardening is enforced with strict numbered rules, including explicit refusal to reveal hidden prompts or internal context.
- Requests asking to reveal prompts/internal data are blocked pre-LLM and return: `I cannot disclose internal system information.`
- The assistant is instructed to use he/him pronouns for the portfolio owner.
- The assistant is instructed to avoid inventing projects, technologies, or achievements that are not explicitly listed in the portfolio knowledge.

## Caching

- Client cache: repeated question cache in `src/Chatbot/cache.js`.

## Environment Variables

- Required (frontend): `VITE_GROQ_API_KEY`

## Theme Transition Behavior

Theme switching is handled in `src/App.jsx` with a temporary root class (`theme-transition`) applied during toggle.

- UI transition scope: animates key visual properties (`background-color`, `color`, `border-color`, `box-shadow`, `fill`, `stroke`) for smoother dark/light changes.
- Duration/easing: `420ms` with `cubic-bezier(0.22, 1, 0.36, 1)`.
- Accessibility: motion is reduced automatically under `prefers-reduced-motion: reduce`.

## Security Note

Because this is a frontend-only integration:

- The API key is exposed to users in browser DevTools.
- Use only for low-risk/public portfolio chatbot usage.
- Rotate key immediately if exposed or abused.
