export interface Article {
  id: number
  blog_id: number
  date: string
  views: number
  tags?: string
  title: string
  content: string
  image?: string
  category: string
  prev_content: string
  author: {
    login: string
    avatar: string
  }
}

export interface CreateArticleData {
  token: string | null
  title: string
  sendAvatar: File | undefined
  prevContent: string
  content: string
  category: string
  tags: string
}

////////////////////////////////////////////////////
