export type TPost = {
  id: string
  body: string
  image?: string
  createdAt: string
  author: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  _count: {
    like: number
  }
  like: {
    id: string
    userId: string
    user: {
      id: string
      firstName: string
      lastName: string
      avatar: string | null
    }
  }[]
}
