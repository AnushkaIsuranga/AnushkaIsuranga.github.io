import siteContent from '../content/portfolio.json'

export const KNOWLEDGE_BASE_VERSION = '1.0.0'

const normalizeText = (value = '') =>
  String(value)
    .replace(/\s+/g, ' ')
    .trim()

const buildSearchableText = (entry) =>
  normalizeText([
    entry.category,
    entry.subcategory,
    entry.title,
    entry.summary,
    entry.content,
    ...(entry.tags ?? []),
    ...(entry.keywords ?? []),
  ].join(' ')).toLowerCase()

const createEntry = ({
  id,
  category,
  subcategory = '',
  title,
  summary,
  content,
  tags = [],
  keywords = [],
  source,
  visibility = 'public',
}) => {
  const baseEntry = {
    id,
    category,
    subcategory,
    title: normalizeText(title),
    summary: normalizeText(summary),
    content: normalizeText(content),
    tags: tags.map((tag) => normalizeText(tag)).filter(Boolean),
    keywords: keywords.map((keyword) => normalizeText(keyword)).filter(Boolean),
    source,
    visibility,
  }

  return {
    ...baseEntry,
    searchableText: buildSearchableText(baseEntry),
  }
}

const profileEntries = [
  createEntry({
    id: 'profile-overview',
    category: 'profile',
    title: `${siteContent.site.name} profile`,
    summary: `${siteContent.site.role} based in ${siteContent.site.location}`,
    content: `${siteContent.site.name} is a ${siteContent.site.role} (${siteContent.site.pronoun}) based in ${siteContent.site.location}. Availability: ${siteContent.site.availability}.`,
    tags: ['profile', 'availability', 'location'],
    keywords: siteContent.site.coreLanes ?? [],
    source: {
      collection: 'site',
      ref: 'site',
    },
  }),
]

const stackEntries = (siteContent.stack?.sections ?? []).map((section, index) => {
  const itemLabels = (section.items ?? []).map((item) => item.label)

  return createEntry({
    id: `stack-${index + 1}`,
    category: 'skills',
    subcategory: section.category.toLowerCase(),
    title: `${section.category} skills`,
    summary: `${section.description}. Tools: ${itemLabels.join(', ')}`,
    content: `${section.category}: ${itemLabels.join(', ')}`,
    tags: ['skills', section.category],
    keywords: itemLabels,
    source: {
      collection: 'stack.sections',
      ref: section.category,
    },
  })
})

const experienceEntries = siteContent.experiences.map((experience, index) =>
  createEntry({
    id: `experience-${index + 1}`,
    category: 'experience',
    subcategory: experience.type.toLowerCase(),
    title: `${experience.role} at ${experience.title}`,
    summary: `${experience.period} — ${experience.summary}`,
    content: `${experience.role} at ${experience.title} (${experience.period}). ${experience.summary}`,
    tags: ['experience', experience.type],
    keywords: experience.focus ?? [],
    source: {
      collection: 'experiences',
      ref: experience.title,
      period: experience.period,
    },
  })
)

const projectEntries = siteContent.projects.map((project, index) =>
  createEntry({
    id: `project-${index + 1}`,
    category: 'project',
    subcategory: project.category,
    title: project.title,
    summary: `${project.summary} Stack: ${(project.stack ?? []).join(', ')}`,
    content: [
      `${project.title} (${project.year})`,
      `Category: ${project.category}`,
      `Challenge: ${project.challenge}`,
      `Delivery: ${project.delivery}`,
      `Impact: ${project.impact}`,
      `Stack: ${(project.stack ?? []).join(', ')}`,
      `Metrics: ${(project.metrics ?? []).join(', ')}`,
      project.liveDemo ? `Live demo: ${project.liveDemo}` : '',
      project.githubRepo ? `GitHub: ${project.githubRepo}` : '',
    ]
      .filter(Boolean)
      .join('. '),
    tags: ['project', project.year, project.category],
    keywords: [...(project.stack ?? []), ...(project.metrics ?? [])],
    source: {
      collection: 'projects',
      ref: project.title,
      year: project.year,
    },
  })
)

const certificationEntries = siteContent.certifications.map((certification, index) =>
  createEntry({
    id: `certification-${index + 1}`,
    category: 'certification',
    title: certification.title,
    summary: `${certification.issuer} (${certification.year})`,
    content: `${certification.title} by ${certification.issuer} in ${certification.year}. ${certification.description}`,
    tags: ['certification', certification.issuer, certification.year],
    keywords: [certification.issuer, certification.year],
    source: {
      collection: 'certifications',
      ref: certification.title,
      url: certification.href,
    },
    visibility: certification.display ? 'public' : 'private',
  })
)

const achievementEntries = siteContent.achievements.map((achievement, index) =>
  createEntry({
    id: `achievement-${index + 1}`,
    category: 'achievement',
    title: achievement.title,
    summary: `${achievement.year}`,
    content: `${achievement.title} (${achievement.year}) - ${achievement.description}`,
    tags: ['achievement', achievement.year],
    keywords: [achievement.year],
    source: {
      collection: 'achievements',
      ref: achievement.title,
      year: achievement.year,
    },
  })
)

const contactEntries = (siteContent.contact?.contactItems ?? []).map((item, index) =>
  createEntry({
    id: `contact-${index + 1}`,
    category: 'contact',
    subcategory: item.label.toLowerCase(),
    title: `${item.label} contact`,
    summary: item.value,
    content: `${item.label}: ${item.value}. ${item.href ? `Reference: ${item.href}` : ''}`,
    tags: ['contact', item.label],
    keywords: [item.value],
    source: {
      collection: 'contact.contactItems',
      ref: item.label,
      href: item.href,
    },
  })
)

const allEntries = [
  ...profileEntries,
  ...stackEntries,
  ...experienceEntries,
  ...projectEntries,
  ...certificationEntries,
  ...achievementEntries,
  ...contactEntries,
]

const sortByRelevance = (entries, query) => {
  const normalizedQuery = normalizeText(query).toLowerCase()
  if (!normalizedQuery) {
    return entries
  }

  return [...entries].sort((left, right) => {
    const leftScore = left.searchableText.includes(normalizedQuery) ? 1 : 0
    const rightScore = right.searchableText.includes(normalizedQuery) ? 1 : 0
    return rightScore - leftScore
  })
}

const SEMANTIC_SYNONYMS = {
  degree: ['education', 'educational', 'diploma', 'bsc', 'certificate', 'qualification', 'qualifications'],
  degrees: ['education', 'educational', 'diploma', 'bsc', 'certificate', 'qualification', 'qualifications'],
  education: ['educational', 'degree', 'diploma', 'bsc', 'certificate', 'qualification', 'qualifications', 'study'],
  educational: ['education', 'degree', 'diploma', 'bsc', 'certificate', 'qualification', 'qualifications', 'study'],
  qualification: ['education', 'degree', 'diploma', 'bsc', 'certificate', 'study'],
  qualifications: ['education', 'degree', 'diploma', 'bsc', 'certificate', 'study'],
  technologies: ['skills', 'stack', 'tools', 'framework', 'frameworks', 'languages'],
  tech: ['skills', 'stack', 'tools', 'framework', 'frameworks', 'languages'],
  framework: ['frameworks', 'skills', 'stack', 'technologies', 'tech', 'tools', 'libraries'],
  frameworks: ['framework', 'skills', 'stack', 'technologies', 'tech', 'tools', 'libraries'],
  work: ['experience', 'projects', 'delivery'],
  job: ['experience', 'role', 'position'],
  roles: ['experience', 'role', 'position'],
  project: ['projects', 'build', 'portfolio', 'case'],
  projects: ['project', 'build', 'portfolio', 'case'],
  ai: ['artificial', 'machine', 'learning', 'ml'],
  backend: ['api', 'server', 'spring', 'node', 'asp.net'],
  frontend: ['react', 'ui', 'interface', 'tailwind', 'vite'],
  contact: ['email', 'phone', 'linkedin', 'reach'],
}

const DOMAIN_KEYWORDS = new Set([
  'anushka',
  'isuranga',
  'portfolio',
  'project',
  'projects',
  'experience',
  'education',
  'degree',
  'diploma',
  'certification',
  'skills',
  'stack',
  'technology',
  'technologies',
  'contact',
  'email',
  'phone',
  'linkedin',
  'github',
  'availability',
  'role',
  'work',
  'career',
])

const tokenize = (text) =>
  normalizeText(text)
    .toLowerCase()
    .split(/[^a-z0-9.+#]+/)
    .filter(Boolean)

const expandTokens = (tokens) => {
  const expanded = new Set(tokens)
  tokens.forEach((token) => {
    const synonyms = SEMANTIC_SYNONYMS[token] ?? []
    synonyms.forEach((synonym) => expanded.add(synonym))
  })
  return expanded
}

const getTokenOverlapScore = (queryTokenSet, entryTokenSet) => {
  let overlapCount = 0
  queryTokenSet.forEach((token) => {
    if (entryTokenSet.has(token)) {
      overlapCount += 1
    }
  })

  if (queryTokenSet.size === 0) {
    return 0
  }

  return overlapCount / queryTokenSet.size
}

const computeSemanticScore = (entry, normalizedQuery) => {
  const queryTokens = tokenize(normalizedQuery)
  if (queryTokens.length === 0) {
    return 0
  }

  const expandedQueryTokens = expandTokens(queryTokens)
  const entryTokens = tokenize(entry.searchableText)
  const entryTokenSet = new Set(entryTokens)

  const overlapScore = getTokenOverlapScore(expandedQueryTokens, entryTokenSet)
  const phraseBoost = entry.searchableText.includes(normalizedQuery) ? 0.35 : 0

  return overlapScore + phraseBoost
}

export const knowledgeBaseEntries = allEntries

export const knowledgeBase = {
  version: KNOWLEDGE_BASE_VERSION,
  generatedAt: new Date().toISOString(),
  collections: {
    profile: profileEntries,
    skills: stackEntries,
    experiences: experienceEntries,
    projects: projectEntries,
    certifications: certificationEntries,
    achievements: achievementEntries,
    contact: contactEntries,
  },
  entries: allEntries,
}

export const getKnowledgeEntries = ({
  categories = [],
  query = '',
  includePrivate = false,
  limit = 12,
} = {}) => {
  const normalizedCategories = categories.map((category) => normalizeText(category).toLowerCase())

  const visibleEntries = allEntries.filter(
    (entry) => includePrivate || entry.visibility !== 'private'
  )

  const filteredByCategory =
    normalizedCategories.length > 0
      ? visibleEntries.filter((entry) => normalizedCategories.includes(entry.category))
      : visibleEntries

  const filteredByQuery =
    query.trim().length > 0
      ? filteredByCategory.filter((entry) => entry.searchableText.includes(query.toLowerCase()))
      : filteredByCategory

  return sortByRelevance(filteredByQuery, query).slice(0, limit)
}

export const retrieveKnowledge = ({
  query = '',
  categories = [],
  includePrivate = false,
  limit = 8,
} = {}) => {
  const normalizedQuery = normalizeText(query).toLowerCase()

  const candidateEntries = getKnowledgeEntries({
    categories,
    includePrivate,
    limit: Math.max(limit * 5, 30),
  })

  if (!normalizedQuery) {
    return candidateEntries.slice(0, limit)
  }

  const scoredEntries = candidateEntries
    .map((entry) => ({
      ...entry,
      relevanceScore: computeSemanticScore(entry, normalizedQuery),
    }))
    .filter((entry) => entry.relevanceScore > 0)
    .sort((left, right) => right.relevanceScore - left.relevanceScore)
    .slice(0, limit)

  return scoredEntries.length > 0 ? scoredEntries : candidateEntries.slice(0, limit)
}

export const isPortfolioQuestion = (query = '') => {
  const tokens = tokenize(query)
  if (tokens.length === 0) {
    return false
  }

  return tokens.some((token) => DOMAIN_KEYWORDS.has(token))
}

export const getKnowledgeContext = ({
  categories = [],
  query = '',
  includePrivate = false,
  limit = 12,
} = {}) =>
  retrieveKnowledge({ categories, query, includePrivate, limit })
    .map((entry) => {
      const fullContentCategories = new Set(['experience', 'project', 'certification', 'achievement'])

      return fullContentCategories.has(entry.category)
        ? `- [${entry.category}] ${entry.content}`
        : `- [${entry.category}] ${entry.title}: ${entry.summary}`
    })
    .join('\n')

export const legacyKnowledgeBase = allEntries.map((entry) => ({
  type: entry.category,
  text: entry.content,
}))
