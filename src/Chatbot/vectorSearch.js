import { knowledgeBaseEntries } from './KnowledgeBase'

export function searchKnowledge(query, limit = 4) {
  const q = query.trim().toLowerCase()
  if (!q) {
    return knowledgeBaseEntries.slice(0, limit)
  }

  const scored = knowledgeBaseEntries.map((item) => {
    const summary = item.summary.toLowerCase()
    const content = item.content.toLowerCase()
    const category = item.category.toLowerCase()

    const score =
      content.split(q).length - 1 +
      summary.split(q).length - 1 +
      (category.includes(q) ? 2 : 0)

    return { ...item, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
