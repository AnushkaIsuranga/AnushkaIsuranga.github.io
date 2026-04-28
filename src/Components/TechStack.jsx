import { FaJava, FaReact, FaLaravel,  } from 'react-icons/fa'
import { PiFileCSharp } from 'react-icons/pi'
import {
  SiAmazonwebservices,
  SiAndroidstudio,
  SiBootstrap,
  SiCss3,
  SiCplusplus,
  SiDocker,
  SiEslint,
  SiExpress,
  SiFastapi,
  SiFigma,
  SiFirebase,
  SiFlask,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiHtml5,
  SiIntellijidea,
  SiJavascript,
  SiJest,
  SiJupyter,
  SiKotlin,
  SiMicrosoftazure,
  SiMicrosoftsqlserver,
  SiMongodb,
  SiMui,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostman,
  SiPostgresql,
  SiPrettier,
  SiPhp,
  SiPython,
  SiSqlite,
  SiSpringboot,
  SiSwagger,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVitest,
  SiVisualstudiocode,
  SiVite,
  SiDotnet,
  SiInertia,
  SiRender 
} from 'react-icons/si'
import { motion } from 'motion/react'
import MobileParallax from '../Animation/MobileParallax'
import Reveal from '../Animation/Reveal'
import { siteContent } from '../content'

const stackIconMap = {
  androidstudio: SiAndroidstudio,
  aws: SiAmazonwebservices,
  azure: SiMicrosoftazure,
  bootstrap: SiBootstrap,
  cpp: SiCplusplus,
  csharp: PiFileCSharp,
  css: SiCss3,
  docker: SiDocker,
  dotnet: SiDotnet,
  eslint: SiEslint,
  expressjs: SiExpress,
  laravel: FaLaravel,
  inertiajs: SiInertia,
  fastapi: SiFastapi,
  figma: SiFigma,
  firebase: SiFirebase,
  flask: SiFlask,
  git: SiGit,
  github: SiGithub,
  githubActions: SiGithubactions,
  html: SiHtml5,
  intellijidea: SiIntellijidea,
  java: FaJava,
  javascript: SiJavascript,
  jest: SiJest,
  jupyter: SiJupyter,
  kotlin: SiKotlin,
  microsoftsqlserver: SiMicrosoftsqlserver,
  mongodb: SiMongodb,
  mui: SiMui,
  mysql: SiMysql,
  nestjs: SiNestjs,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  postman: SiPostman,
  postgresql: SiPostgresql,
  prettier: SiPrettier,
  php: SiPhp,
  python: SiPython,
  react: FaReact,
  reactnative: FaReact,
  render: SiRender,
  sqlite: SiSqlite,
  springboot: SiSpringboot,
  swagger: SiSwagger,
  tailwind: SiTailwindcss,
  typescript: SiTypescript,
  vercel: SiVercel,
  vitest: SiVitest,
  vite: SiVite,
  vscode: SiVisualstudiocode,
}

const getStackFallback = (label = '') =>
  label
    .split(/[\s./+#-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0])
    .join('')
    .toUpperCase()

export default function TechStack() {
  const stackSections = Array.isArray(siteContent.stack.sections)
    ? siteContent.stack.sections
    : Array.isArray(siteContent.stack.items)
      ? [{ category: 'All Tools', items: siteContent.stack.items }]
      : []

  return (
    <div className="section-inner">
      <div className="glass-panel relative overflow-hidden rounded-[2.5rem] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(96,165,250,0.12),transparent_28%),radial-gradient(circle_at_80%_68%,rgba(167,139,250,0.12),transparent_28%)]" />

        <div className="relative z-10">
          <div className="section-header mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="section-label">Tools & Tech Stack</span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                id="stack-title"
                className="section-title bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent"
              >
                {siteContent.stack.title}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="section-copy mx-auto max-w-2xl">{siteContent.stack.copy}</p>
            </Reveal>
          </div>

          <div className="mt-14 space-y-16">
            {stackSections.map((section, sectionIndex) => (
              <div key={section.category} className="space-y-6">
                <div className="border-l-2 border-indigo-300/30 pl-4">
                  <Reveal delay={sectionIndex * 0.02}>
                    <h3 className="text-lg font-semibold text-white">{section.category}</h3>
                  </Reveal>
                  {section.description && (
                    <Reveal delay={sectionIndex * 0.02 + 0.01}>
                      <p className="mt-2 text-sm text-white/50">{section.description}</p>
                    </Reveal>
                  )}
                </div>

                <MobileParallax offset={24} scale={1.02} className="mx-auto w-full">
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {section.items?.map(({ label, iconKey }, itemIndex) => {
                      const Icon = stackIconMap[iconKey]
                      const globalIndex = sectionIndex * 20 + itemIndex

                      return (
                        <motion.div
                          key={label}
                          className="inline-flex items-center gap-3 rounded-full border border-indigo-200/20 bg-black/30 px-4 py-3 backdrop-blur-xl transition-colors hover:border-indigo-300/40"
                          whileHover={{ y: -4, scale: 1.02 }}
                          transition={{ duration: 0.2, delay: itemIndex * 0.02 }}
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-base text-sky-300">
                            {Icon ? (
                              <Icon />
                            ) : (
                              <span className="text-[0.65rem] font-semibold tracking-[0.16em] text-sky-200">
                                {getStackFallback(label)}
                              </span>
                            )}
                          </span>
                          <span className="text-sm font-medium text-white">{label}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </MobileParallax>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
