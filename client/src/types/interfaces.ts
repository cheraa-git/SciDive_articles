export interface Article {
  id: number
  date: string
  views: number
  tags?: string
  blogId: number
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

////////////////////////////////////////////////////

export interface IUserInitialState {
  login: string
  blogId: number
  subscribes: number[]
}