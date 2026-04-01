import { motion } from 'motion/react'
import { FiExternalLink } from 'react-icons/fi'
import Reveal from '../Animation/Reveal'
import MobileParallax from '../Animation/MobileParallax'
import { siteContent } from '../content'

export default function Certifications() {
  const certifications = siteContent.certifications?.filter((cert) => cert.display) || []

  return (
    <div className="section-inner">
      <div className="glass-panel relative overflow-hidden rounded-[2.5rem] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(96,165,250,0.12),transparent_28%),radial-gradient(circle_at_80%_68%,rgba(167,139,250,0.12),transparent_28%)]" />

        <div className="relative z-10">
          <div className="section-header mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="section-label">Professional Development</span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                id="certifications-title"
                className="section-title bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent"
              >
                Certifications & Credentials
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="section-copy mx-auto max-w-2xl">
                Industry-recognized certifications in cloud platforms, DevOps, and modern software
                architecture.
              </p>
            </Reveal>
          </div>

          <MobileParallax offset={24} scale={1.02} className="mx-auto w-full">
            <div className="mx-auto mt-12 max-w-4xl space-y-4">
              {certifications.map((cert, index) => (
                <motion.a
                  key={cert.title}
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-indigo-200/20 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-indigo-300/40 hover:bg-white/[0.05]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {cert.issuer}
                        {cert.year && (
                          <span className="ml-2 inline-block text-xs text-slate-500">
                            ({cert.year})
                          </span>
                        )}
                      </p>
                      {cert.description && (
                        <p className="mt-3 text-sm text-slate-300">{cert.description}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-indigo-300/30 bg-indigo-500/10 text-lg group-hover:bg-indigo-500/20 transition-colors">
                        <FiExternalLink className="text-indigo-300" />
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </MobileParallax>
        </div>
      </div>
    </div>
  )
}
