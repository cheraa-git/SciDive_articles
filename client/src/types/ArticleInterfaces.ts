export interface Article {
  id: number
  date: string
  views: number
  tags?: string
  blog_id: number
  author: {
    login: string
    avatar: string
  }
  info: {
    title: string
    content: string
    image?: string
  }
}

export interface IArticleInitialState {
  articles: Article[]
}