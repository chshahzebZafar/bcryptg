export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  lastModified: string
  tags: string[]
  readingTime: string
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
