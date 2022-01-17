export interface Article {
  id: number
  blogId: number
  date: string
  views: number
  tags?: string
  title: string
  content: string
  image?: string
  category: string
  prevContent: string
  author: {
    login: string
    avatar: string
  }
}


////////////////////////////////////////////////////

