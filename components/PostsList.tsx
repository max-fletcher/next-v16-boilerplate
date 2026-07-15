'use client'
import { TPost } from '@/types/posts.types'
import SideMenu from './SideMenu'
import SinglePost from './SinglePost'

type TPostsListProps = {
  optimisticPosts: TPost[]
  handleLike: (post: TPost) => void
  handleCreateComment: (body: string, postId: string) => void
  isPending: boolean
}

const PostsList = ({ optimisticPosts, handleLike, handleCreateComment, isPending }: TPostsListProps) => {
  return (
    <>
      {optimisticPosts.map((post) => (
        <SideMenu key={post.id}>
          <SinglePost key={post.id} post={post} onLike={handleLike} handleCreateComment={handleCreateComment} isPending={isPending} />
        </SideMenu>
      ))}
    </>
  )
}

export default PostsList
