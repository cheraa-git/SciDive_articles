// ARTICLE
export interface Article {
  id: number
  blog_id: number
  date: string
  views: number
  tags?: string[]
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
  sendAvatar: File | undefined | string
  prevContent: string
  content: string
  category: string
  tags: string[]
  id?: number
}

////////////////////////////////////////////////////
//PROFILE
export interface ProfileSubscribeItem {
  login: string
  avatar: string
  blog_id: number
}

export interface ProfilePayload {
  avatar: string
  login: string
  blog_id: number
  subscribers: ProfileSubscribeItem[]
  subscriptions: ProfileSubscribeItem[]
}

export interface EditProfileSendData {
  image?: File
  newPassword?: string
  oldPassword?: string
  oldEmail?: string
  newEmail?: string
  newLogin?: string
  forgotCode?: string
}

export interface Search {
  request: string
  title: boolean
  tags: boolean
  content: boolean
}
