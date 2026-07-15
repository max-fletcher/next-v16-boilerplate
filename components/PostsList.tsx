'use client'
import SinglePost from './SinglePost'
import { TPost } from '@/types/posts.types'

const PostsList = ({ optimisticPosts, handleLike, isPending }: { optimisticPosts: TPost[]; handleLike: (post: TPost) => void; isPending: boolean }) => {
  return (
    <>
      {optimisticPosts.map((post) => (
        <SinglePost key={post.id} post={post} onLike={handleLike} isPending={isPending} />
      ))}
    </>
  )
}

export default PostsList
