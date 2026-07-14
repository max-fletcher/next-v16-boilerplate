'use client'
import { useState } from 'react'
import SinglePost from './SinglePost'

export type TPost = {
  id: string
  body: string
  image: string
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
  like: [
    {
      id: string
      userId: string
      user: {
        id: string
        firstName: string
        lastName: string
        avatar: string
      }
    }
  ]
}

const PostsList = ({ initialPosts }: { initialPosts: TPost[] }) => {
  console.log('PostsList boi', initialPosts)
  const [posts, setPosts] = useState<TPost[]>(initialPosts)

  return (
    <>
      {posts.map((post, index) => (
        <SinglePost key={index} post={post} />
      ))}
    </>
  )
}

export default PostsList
