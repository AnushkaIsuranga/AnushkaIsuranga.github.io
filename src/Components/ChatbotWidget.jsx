import { useEffect, useMemo, useRef, useState } from 'react'
import { FiLoader, FiMessageSquare, FiSend, FiX } from 'react-icons/fi'
import { currentWork, projectsData, siteContent, socialLinks } from '../content'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const MAX_INPUT_LENGTH = 260
const MAX_HISTORY_ITEMS = 12

const extractSummaryProjects = (projects) =>
  projects
    .slice(0, 4)
    .map((project) => `${project.title}: ${project.summary}`)
    .join('; ')

const extractCoreSkills = (stackSections) => {
  if (!Array.isArray(stackSections)) {
    return ''
  }

  return stackSections
    .flatMap((section) => section.items ?? [])
    .map((item) => item.label)
    .slice(0, 18)
    .join(', ')
}

const createSystemPrompt = () => {
  const contactEmail =
    siteContent.contact.contactItems.find((item) => item.label.toLowerCase() === 'email')?.value ??
    ''

  const linkedinUrl = socialLinks.find((item) => item.id === 'linkedin')?.href ?? ''

  return `You are the AI assistant for ${siteContent.site.name}'s portfolio website.
Role: ${siteContent.site.role}
Pronoun: ${siteContent.site.pronoun}
Location: ${siteContent.site.location}
Availability: ${siteContent.site.availability}
Current role: ${currentWork?.role ?? 'Not specified'} at ${currentWork?.organization ?? 'N/A'}
Core skills: ${extractCoreSkills(siteContent.stack.sections)}
Project highlights: ${extractSummaryProjects(projectsData)}
Contact: ${contactEmail || 'Use the contact section on this website'}${linkedinUrl ? ` | LinkedIn: ${linkedinUrl}` : ''}

Rules:
- Keep answers concise: 2-3 sentences.
- Be friendly, professional, and accurate.
- Only answer questions related to ${siteContent.site.name}, portfolio work, skills, projects, experience, or contact.
- If a question is unrelated or unknown, suggest contacting ${siteContent.site.name} directly via the contact section.
- Do not invent facts.`
}

const toChatMessage = (role, text) => ({
  role,
  content: text,
})

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toggleButtonRef = useRef(null)
  const panelRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: 'bot',
      text: `Hi, I am ${siteContent.site.name}'s AI assistant. Ask me about skills, projects, or experience.`,
    },
  ])
  const [history, setHistory] = useState([])

  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY
  const systemPrompt = useMemo(() => createSystemPrompt(), [])

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

  const sendMessage = async () => {
    const text = inputValue.trim()
    if (!text || isLoading) {
      return
    }

    pushMessage('user', text)
    setInputValue('')

    if (!groqApiKey) {
      pushMessage(
        'bot',
        'Groq API key is missing. Add VITE_GROQ_API_KEY to your environment.'
      )
      return
    }

    const nextHistory = [...history, toChatMessage('user', text)].slice(-MAX_HISTORY_ITEMS)
    setHistory(nextHistory)
    setIsLoading(true)

    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'system', content: systemPrompt }, ...nextHistory],
          temperature: 0.7,
          max_tokens: 500,
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
      const reply = data.choices?.[0]?.message?.content

      if (!reply) {
        throw new Error('Empty response from Groq')
      }

      pushMessage('bot', reply)
      setHistory((current) => [...current, toChatMessage('assistant', reply)].slice(-MAX_HISTORY_ITEMS))
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('429') || error.message.includes('rate_limit'))
      ) {
        pushMessage('bot', 'Rate limit reached. Wait a moment and try again.')
      } else if (
        error instanceof Error &&
        (error.message.includes('401') || error.message.includes('403'))
      ) {
        pushMessage('bot', 'API key is invalid. Check VITE_GROQ_API_KEY in your environment.')
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
            <p
              key={message.id}
              className={`chatbot-message ${message.role === 'user' ? 'is-user' : 'is-bot'}`}
            >
              {message.text}
            </p>
          ))}

          {isLoading ? (
            <p className="chatbot-message is-bot is-loading">
              <FiLoader className="animate-spin" aria-hidden="true" />
              Thinking...
            </p>
          ) : null}
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