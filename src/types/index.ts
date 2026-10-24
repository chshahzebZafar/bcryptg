export interface BlogPost {
  slug: string
  title: string
  // Optional shorter <title> for search results; the page H1 keeps `title`.
  seoTitle?: string
  description: string
  date: string
  lastModified: string
  tags: string[]
  readingTime: string
  draft?: boolean
  content?: string
}

export interface HashHistoryItem {
  hash: string
  rounds: number
  timestamp: number
}

export interface FAQ {
  q: string
  a: string
}
