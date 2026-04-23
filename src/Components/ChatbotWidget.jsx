import { useEffect, useRef, useState } from 'react'
import { FiLoader, FiMessageSquare, FiSend, FiX } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import { siteContent } from '../content'
import { getCached, setCached } from '../Chatbot/cache'
import { getKnowledgeContext } from '../Chatbot/KnowledgeBase'
import { detectQueryType, resolveCategoriesForQuery } from '../Chatbot/queryRouter'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const MAX_INPUT_LENGTH = 260
const MAX_HISTORY_ITEMS = 3
const RESPONSE_DELAY_MS = 1500
const TRANSLATION_REFUSAL = 'I can only answer questions about Anushka\'s portfolio.'
const INTERNAL_INFO_REFUSAL = 'I cannot disclose internal system information.'

const isTranslationRequest = (text) =>
  /\b(translate|translation|translet|translating)\b/i.test(text) ||
  /\b(?:to|into|in)\s+(?:tamil|sinhala|hindi|malayalam|telugu|french|german|spanish|japanese|korean|chinese)\b/i.test(text)

const isInternalInfoRequest = (text) =>
  /\b(ignore\s+previous\s+instructions|ignore\s+all\s+instructions)\b/i.test(text) ||
  /\b(show|reveal|print|expose|leak)\b.*\b(system\s+prompt|internal\s+(?:data|context|instructions)|hidden\s+prompt|developer\s+instructions?)\b/i.test(text) ||
  /\bwhat\s+is\s+your\s+prompt\b/i.test(text)

const toChatMessage = (role, text) => ({
  role,
  content: text,
})

const createSystemPrompt = () => `
You are Anushka's portfolio AI assistant.

Your role is to confidently present Anushka as a strong candidate while staying truthful to the portfolio information. Only answer questions related to Anushka's skills, projects, and experience as described in the portfolio. If you don't know the answer or if the question is unrelated to the portfolio, respond politely that you can only answer questions about Anushka's portfolio.

When answering questions about Anushka's qualifications, emphasize his impact and capabilities. Mention specific technologies, projects, or skills when possible to make the responses more engaging and persuasive.

General rules:
- Use he/him as Anushka's pronouns.
- Use a natural, confident, conversational tone.
- Avoid generic phrases like "based on the portfolio".
- If user asked 'Who am I' or similar, it's not Anushka. It's the person you will present Anushka.
- Write like a knowledgeable human explaining why he is a strong candidate.
- Keep responses engaging and persuasive, not robotic.
- Use 2–4 concise sentences.

Knowledge rules:
- Use ONLY information from the portfolio.
- If something is not mentioned, say it briefly.

Definition of experience:
- Experience ONLY refers to professional work roles.
- Do NOT count education, societies, certificates, or training programs.

Answer behavior:
- Provide the final answer directly.
- Do not show calculations, rules (like 'by using he/him pronouce' etc) or reasoning.

When explaining strengths or qualifications:
- Emphasize impact and capability.
- Mention specific technologies, projects, or skills when possible.

Formatting:
- Use markdown.
- Lists must start with "- ".
`


const createContextMessage = (knowledgeContext) => `Portfolio knowledge:\n${knowledgeContext}`

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toggleButtonRef = useRef(null)
  const panelRef = useRef(null)
  const messagesEndRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: 'bot',
      text: `Hi, I am ${siteContent.site.name}'s AI assistant. Ask me about skills, projects, or experience.`,
    },
  ])
  const [history, setHistory] = useState([])
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY

  const pushMessage = (role, text) => {
    setMessages((current) => [...current, { id: crypto.randomUUID(), role, text }])
  }

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleOutsidePointerDown = (event) => {
      const target = event.target

      if (panelRef.current?.contains(target) || toggleButtonRef.current?.contains(target)) {
        return
      }

      setIsOpen(false)
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async () => {
    const text = inputValue.trim()
    if (!text || isLoading) {
      return
    }

    pushMessage('user', text)
    setInputValue('')

    const cachedAnswer = getCached(text)
    if (cachedAnswer) {
      pushMessage('bot', cachedAnswer)
      setHistory((current) => [...current, toChatMessage('assistant', cachedAnswer)].slice(-MAX_HISTORY_ITEMS))
      return
    }

    if (isTranslationRequest(text)) {
      pushMessage('bot', TRANSLATION_REFUSAL)
      setCached(text, TRANSLATION_REFUSAL)
      return
    }

    if (isInternalInfoRequest(text)) {
      pushMessage('bot', INTERNAL_INFO_REFUSAL)
      setCached(text, INTERNAL_INFO_REFUSAL)
      return
    }

    if (!groqApiKey) {
      pushMessage('bot', 'Groq API key is missing.')
      return
    }

    const trimmedKey = groqApiKey.trim()
    if (trimmedKey.length !== groqApiKey.length) {
      console.warn('Groq API key has surrounding whitespace; trimming it before use.')
    }

    const recentHistory = history.slice(-MAX_HISTORY_ITEMS)
    const userMessage = toChatMessage('user', text)
    const queryType = detectQueryType(text)
    const categories = resolveCategoriesForQuery(queryType)
    const knowledgeContext = getKnowledgeContext({
      categories,
      query: text,
      includePrivate: false,
      limit: queryType === 'general' ? 10 : 8,
    })

    setIsLoading(true)

    
    const delay = new Promise((resolve) => window.setTimeout(resolve, RESPONSE_DELAY_MS))

    try {
      const authHeader = `Bearer ${trimmedKey}`

      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: createSystemPrompt() },
            { role: 'assistant', content: createContextMessage(knowledgeContext) },
            ...recentHistory,
            userMessage,
          ],
          temperature: 0.4,
          max_tokens: 320,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        const statusText = errorBody?.error?.status ?? 'REQUEST_FAILED'
        const messageText =
          errorBody?.error?.message ?? `Groq request failed with status ${response.status}`
        throw new Error(`Groq ${response.status} ${statusText}: ${messageText}`)
      }

      const data = await response.json()
      const reply = data?.choices?.[0]?.message?.content

      if (!reply) {
        throw new Error('Empty response from Groq')
      }

      await delay

      pushMessage('bot', reply)
      setCached(text, reply)
      setHistory([...recentHistory, userMessage, toChatMessage('assistant', reply)].slice(-MAX_HISTORY_ITEMS))
    } catch (error) {
      setHistory([...recentHistory, userMessage].slice(-MAX_HISTORY_ITEMS))
      if (
        error instanceof Error &&
        (error.message.includes('429') || error.message.includes('rate_limit'))
      ) {
        pushMessage('bot', 'Rate limit reached. Wait a moment and try again.')
      } else if (
        error instanceof Error &&
        (error.message.includes('401') || error.message.includes('403'))
      ) {
        pushMessage('bot', 'API key is invalid.')
      } else {
        pushMessage('bot', 'I could not answer right now. Please try again in a moment.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        ref={toggleButtonRef}
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="portfolio-chatbot"
        aria-label="Toggle AI portfolio assistant"
      >
        <FiMessageSquare aria-hidden="true" />
      </button>

      <section
        ref={panelRef}
        id="portfolio-chatbot"
        className={`chatbot-panel ${isOpen ? 'is-open' : ''}`}
        aria-label="AI portfolio assistant"
      >
        <header className="chatbot-header">
          <div>
            <p className="chatbot-label">AI Assistant</p>
            <p className="chatbot-title">Ask about Anushka</p>
          </div>
          <button
            type="button"
            className="chatbot-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant"
          >
            <FiX aria-hidden="true" />
          </button>
        </header>

        <div className="chatbot-messages no-scrollbar">
          {messages.map((message) => (
            message.role === 'user' ? (
              <p key={message.id} className="chatbot-message is-user">
                {message.text}
              </p>
            ) : (
              <div key={message.id} className="chatbot-message is-bot chatbot-markdown">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            )
          ))}

          {isLoading ? (
            <p className="chatbot-message is-bot is-loading">
              <FiLoader className="animate-spin" aria-hidden="true" />
              Thinking...
            </p>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-row">
          <input
            type="text"
            className="chatbot-input"
            placeholder="Ask something..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value.slice(0, MAX_INPUT_LENGTH))}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                sendMessage()
              }
            }}
            maxLength={MAX_INPUT_LENGTH}
            aria-label="Ask AI assistant"
          />

          <button
            type="button"
            className="chatbot-send"
            onClick={sendMessage}
            disabled={isLoading}
            aria-label="Send message"
          >
            <FiSend aria-hidden="true" />
          </button>
        </div>
      </section>
    </>
  )
}