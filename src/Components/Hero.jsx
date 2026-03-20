import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FiArrowDownRight, FiDownload, FiMail } from 'react-icons/fi'
import { SiMedium } from 'react-icons/si'
import { motion } from 'motion/react'
import MobileParallax from '../Animation/MobileParallax'
import Reveal from '../Animation/Reveal'
import StaggerText from '../Animation/StaggerText'
import portrait from '../assets/my_pic.webp'
import { portfolioStats, siteContent, socialLinks } from '../content'

const socialIconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  medium: SiMedium,
}

const ctaIconMap = {
  arrowDownRight: FiArrowDownRight,
  download: FiDownload,
  mail: FiMail,
}

export default function Hero() {
  const heroSocialLinks = siteContent.hero.heroSocialLinkIds
    .map((id) => socialLinks.find((link) => link.id === id))
    .filter(Boolean)

  const proofStats = [
    {
      value: portfolioStats.projectCount,
      label: siteContent.hero.proofLabels.caseStudies,
    },
    {
      value: portfolioStats.liveDemoCount,
      label: siteContent.hero.proofLabels.liveDemos,
    },
    {
      value: portfolioStats.coreLaneCount,
      label: `${siteContent.hero.proofLabels.coreLanesPrefix} ${siteContent.site.coreLanes.join(', ')}`,
    },
    {
      value: portfolioStats.firstWorkYear ?? 'Now',
      label: siteContent.hero.proofLabels.workStart,
    },
  ]

  return (
    <section
      id="hero"
      className="section-shell pt-[7.5rem] sm:pt-[8rem] lg:pt-[8.5rem]"
      aria-label="Introduction"
    >
      <div className="section-inner">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="glass-panel relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_32%),radial-gradient(circle_at_82%_10%,rgba(139,92,246,0.16),transparent_20%)]" />

            <div className="relative z-10">
              <Reveal>
                <span className="eyebrow-chip">{siteContent.site.locationLabel}</span>
              </Reveal>

              <Reveal delay={0.06}>
                <p className="hero-kicker mt-6">{siteContent.hero.kicker}</p>
              </Reveal>

              <div className="mt-4 max-w-4xl">
                <StaggerText
                  text={siteContent.hero.headline}
                  className="hero-title block"
                  charClassName="bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent"
                />
              </div>

              <Reveal delay={0.12} className="mt-6 max-w-2xl">
                <p className="text-base leading-8 text-slate-300 sm:text-lg">{siteContent.hero.intro}</p>
              </Reveal>

              <Reveal delay={0.18} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {siteContent.hero.ctaButtons.map((button) => {
                  const Icon = ctaIconMap[button.iconKey]

                  return (
                    <motion.a
                      key={button.label}
                      href={button.href}
                      target={button.external ? '_blank' : undefined}
                      rel={button.external ? 'noopener noreferrer' : undefined}
                      className={button.variant === 'primary' ? 'button-primary' : 'button-secondary'}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {button.label}
                      {Icon ? <Icon className="text-lg" /> : null}
                    </motion.a>
                  )
                })}
              </Reveal>

              <Reveal delay={0.24} className="mt-10">
                <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
                  {siteContent.hero.quickFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="surface-muted min-w-[16rem] snap-start rounded-[1.5rem] p-5 sm:min-w-0"
                    >
                      <p className="metric-label text-[#7dd3fc]">{fact.label}</p>
                      <p className="mt-3 text-base font-semibold text-white">{fact.value}</p>
                      <p className="mt-3 text-sm leading-7 text-slate-400">{fact.detail}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          <div className="space-y-6">
            <Reveal delay={0.08} direction="left">
              <div className="editorial-card overflow-hidden rounded-[2rem] p-4 sm:p-5">
                <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10">
                  <MobileParallax className="relative" offset={64} scale={1.14}>
                    <img
                      src={portrait}
                      alt={`Portrait of ${siteContent.site.name}`}
                      className="h-[22rem] w-full object-cover sm:h-[28rem]"
                      loading="lazy"
                      decoding="async"
                    />
                  </MobileParallax>

                  <div className="hero-image-overlay absolute inset-x-0 bottom-0 p-6">
                    <span className="eyebrow-chip overlay-chip">
                      {siteContent.site.availability}
                    </span>
                    <h2 className="mt-4 text-2xl font-semibold text-white">
                      Product-minded engineering with a clear visual finish
                    </h2>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal delay={0.14}>
                <div className="stat-card h-full">
                  <p className="metric-label text-[#7dd3fc]">What I focus on</p>
                  <div className="mt-5 space-y-4">
                    {siteContent.hero.focusAreas.map((area) => (
                      <div key={area.title} className="flex items-start gap-3">
                        <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-[#38bdf8]" />
                        <div>
                          <p className="text-sm font-semibold text-white">{area.title}</p>
                          <p className="mt-1 text-sm leading-7 text-slate-400">{area.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="stat-card h-full">
                  <p className="metric-label text-indigo-300">Find me here</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {heroSocialLinks.map(({ href, iconKey, label }) => {
                      const Icon = socialIconMap[iconKey]

                      return (
                        <motion.a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200"
                          whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        >
                          {Icon ? <Icon className="text-base" /> : null}
                          {label}
                        </motion.a>
                      )
                    })}
                  </div>

                  <div className="surface-muted mt-6 rounded-[1.35rem] p-4">
                    <p className="metric-label text-white/55">{siteContent.hero.bestFitLabel}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{siteContent.hero.bestFitText}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <Reveal delay={0.24} className="mt-6">
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4">
            {proofStats.map((item) => (
              <div key={item.label} className="stat-card min-w-[15rem] snap-start md:min-w-0">
                <p className="metric-value text-white">{item.value}</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
