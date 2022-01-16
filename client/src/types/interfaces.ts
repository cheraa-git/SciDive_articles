export interface Article {
  id: number
  date: string
  views: number
  tags?: string
  author: {
    id: number
    name: string
    avatar: string
  }
  info: {
    title: string
    content: string
    image?: string
  }
}
