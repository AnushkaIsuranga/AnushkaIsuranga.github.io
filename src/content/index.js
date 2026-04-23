import HMS from '../assets/HMS.webp'
import HostelApp from '../assets/HostelApp.webp'
import horizon from '../assets/HorizonNewsApp.webp'
import envirosense from '../assets/enviro_sense.webp'
import stockPortal from '../assets/stock_p.webp'
import portfolio from './portfolio.json'
import hotel_booking from '../assets/hotel_booking.webp'
import sobriety_app from '../assets/sobriety_app.webp'

const projectImages = {
  hostel: HostelApp,
  hospital: HMS,
  stockPortal,
  horizon,
  envirosense,
  hotel_booking,
  sobriety_app
}

const getStartYear = (period = '') => {
  const match = period.match(/\b\d{4}\b/)
  return match ? Number(match[0]) : null
}

const resolveProjectImage = (project) => ({
  ...project,
  image: projectImages[project.imageKey] ?? project.image ?? '',
})

export const siteContent = portfolio
export const navigationSections = portfolio.navigation
export const socialLinks = portfolio.socialLinks
export const projectsData = portfolio.projects.map(resolveProjectImage)
export const experiencesData = portfolio.experiences

const workExperiences = experiencesData.filter((experience) => experience.type === 'Work')

export const currentWork = workExperiences[0] ?? null
export const latestEducation =
  experiencesData.find((experience) => experience.type === 'Education') ?? null
export const currentLeadership =
  experiencesData.find(
    (experience) =>
      experience.type === 'Leadership' && experience.period.toLowerCase().includes('present')
  ) ?? null

export const experienceCounts = experiencesData.reduce((counts, experience) => {
  counts[experience.type] = (counts[experience.type] ?? 0) + 1
  return counts
}, {})

const liveDemoCount = projectsData.filter((project) => Boolean(project.liveDemo)).length
const firstWorkYear = workExperiences
  .map((experience) => getStartYear(experience.period))
  .filter(Boolean)
  .sort((left, right) => left - right)[0]

export const portfolioStats = {
  projectCount: projectsData.length,
  liveDemoCount,
  privateBuildCount: projectsData.length - liveDemoCount,
  coreLaneCount: siteContent.site.coreLanes.length,
  firstWorkYear,
}
