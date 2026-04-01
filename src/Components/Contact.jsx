import { useState } from 'react'
import emailjs from 'emailjs-com'
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'
import { SiGithub, SiInstagram, SiLinkedin, SiMedium, SiWhatsapp } from 'react-icons/si'
import { AnimatePresence, motion } from 'motion/react'
import MobileParallax from '../Animation/MobileParallax'
import Reveal from '../Animation/Reveal'
import { siteContent, socialLinks } from '../content'

const initialForm = {
  name: '',
  email: '',
  message: '',
}

const socialIconMap = {
  github: SiGithub,
  instagram: SiInstagram,
  linkedin: SiLinkedin,
  medium: SiMedium,
  whatsapp: SiWhatsapp,
}

const contactIconMap = {
  location: FiMapPin,
  mail: FiMail,
  phone: FiPhone,
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSending(true)
    setFeedback({ type: '', message: '' })

    const {
      serviceId: serviceID,
      templateId: templateID,
      userId: userID,
    } = siteContent.contact.emailjs

    try {
      await emailjs.sendForm(serviceID, templateID, event.target, userID)
      setForm(initialForm)
      setFeedback({
        type: 'success',
        message: siteContent.contact.form.successMessage,
      })
    } catch {
      setFeedback({
        type: 'error',
        message: siteContent.contact.form.errorMessage,
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="section-inner">
      <div className="glass-panel overflow-hidden rounded-[2.2rem] p-6 sm:p-8 lg:p-10">
        <div className="section-header max-w-3xl">
          <Reveal>
            <span className="section-label">Contact</span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              id="contact-title"
              className="section-title bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent"
            >
              {siteContent.contact.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="section-copy max-w-2xl">{siteContent.contact.copy}</p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)]">
          <div className="space-y-5">
            <Reveal>
              <div className="stat-card">
                <p className="metric-label text-[#7dd3fc]">{siteContent.contact.bestFitLabel}</p>
                <p className="mt-4 text-lg font-semibold text-white">
                  {siteContent.contact.bestFitText}
                </p>
              </div>
            </Reveal>

            {siteContent.contact.contactItems.map(({ label, value, href, iconKey }, index) => {
              const Icon = contactIconMap[iconKey]

              return (
                <Reveal key={label} delay={0.05 + index * 0.04}>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-card flex items-center justify-between rounded-[1.5rem] px-5 py-4"
                    whileHover={{ x: 6 }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#7dd3fc]">
                        {Icon ? <Icon /> : null}
                      </span>
                      <div>
                        <p className="metric-label text-white/55">{label}</p>
                        <p className="mt-1 text-base font-medium text-white">{value}</p>
                      </div>
                    </div>

                    <FiArrowUpRight className="text-slate-500" />
                  </motion.a>
                </Reveal>
              )
            })}

            <Reveal delay={0.18}>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ label, href, iconKey }) => {
                  const Icon = socialIconMap[iconKey]

                  return (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200"
                      whileHover={{
                        y: -3,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      {Icon ? <Icon /> : null}
                      {label}
                    </motion.a>
                  )
                })}
              </div>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.12}>
            <MobileParallax offset={48} scale={1.12}>
              <div className="editorial-card rounded-[2rem] p-6 sm:p-8">
                <div className="mb-6">
                  <p className="section-label">{siteContent.contact.form.label}</p>
                  <h3 className="mt-4 text-3xl font-semibold text-white">
                    {siteContent.contact.form.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {siteContent.contact.form.copy}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {feedback.message ? (
                    <motion.div
                      key={feedback.message}
                      className={`mb-6 rounded-[1.25rem] px-4 py-4 text-sm leading-6 ${
                        feedback.type === 'success'
                          ? 'bg-emerald-400/12 text-emerald-100'
                          : 'bg-rose-400/12 text-rose-100'
                      }`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      {feedback.message}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm text-slate-300">
                        {siteContent.contact.form.fields.nameLabel}
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder={siteContent.contact.form.fields.namePlaceholder}
                        className="contact-input"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm text-slate-300">
                        {siteContent.contact.form.fields.emailLabel}
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={siteContent.contact.form.fields.emailPlaceholder}
                        className="contact-input"
                        required
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">
                      {siteContent.contact.form.fields.messageLabel}
                    </span>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows="6"
                      placeholder={siteContent.contact.form.fields.messagePlaceholder}
                      className="contact-input resize-none"
                      required
                    />
                  </label>

                  <motion.button
                    type="submit"
                    className="button-primary w-full justify-center"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSending}
                  >
                    <FiSend />
                    {isSending
                      ? siteContent.contact.form.sendingLabel
                      : siteContent.contact.form.submitLabel}
                  </motion.button>
                </form>
              </div>
            </MobileParallax>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <footer className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>
                {new Date().getFullYear()} {siteContent.site.name}.{' '}
                {siteContent.site.role.toLowerCase()} portfolio.
              </p>
              <p className="metric-label text-white/45">{siteContent.site.footerLocation}</p>
            </div>
          </footer>
        </Reveal>
      </div>
    </div>
  )
}
