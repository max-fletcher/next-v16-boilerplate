'use client'
import { useOptimistic, useState, useTransition } from 'react'
import SinglePost from './SinglePost'
import { useSession } from 'next-auth/react'

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

export enum LikeActionTypes {
  ADD = 'add',
  REMOVE = 'remove'
}

type LikeAction = { type: LikeActionTypes.ADD; postId: string; like: TPost['like'][number] } | { type: LikeActionTypes.REMOVE; postId: string; userId: string }

const PostsList = ({ initialPosts }: { initialPosts: TPost[] }) => {
  console.log('PostsList boi', initialPosts)
  const [posts, setPosts] = useState<TPost[]>(initialPosts)
  const [isPending, startTransition] = useTransition()
  const { data: session } = useSession()

  const [optimisticPosts, applyOptimisticLike] = useOptimistic<TPost[], LikeAction>(posts, (currentPosts, action) =>
    currentPosts.map((post) => {
      if (post.id !== action.postId) return post

      if (action.type === LikeActionTypes.ADD) {
        return {
          ...post,
          like: [...post.like, action.like],
          _count: { ...post._count, like: post._count.like + 1 }
        }
      } else {
        return {
          ...post,
          like: post.like.filter((l) => l.userId !== action.userId),
          _count: { ...post._count, like: post._count.like - 1 }
        }
      }
    })
  )

  function handleLike(post: TPost) {
    if (!session?.user) return

    const userId = session.user.id
    const alreadyLiked = post.like.some((l) => l.userId === userId)

    startTransition(async () => {
      // optimistic update
      if (alreadyLiked) {
        applyOptimisticLike({ type: LikeActionTypes.REMOVE, postId: post.id, userId: userId })
      } else {
        applyOptimisticLike({
          type: LikeActionTypes.ADD,
          postId: post.id,
          like: {
            id: `temp-${Date.now()}`, // pseudo id
            userId,
            user: {
              id: userId,
              firstName: session.user.firstName ?? '',
              lastName: session.user.lastName ?? '',
              avatar: session.user.avatar ?? ''
            }
          }
        })
      }

      // backend call
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/likes`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.accessToken}`
          },
          body: JSON.stringify({
            postId: post.id
          })
        })

        console.log('res111222', res)

        if (!res.ok) throw new Error('Like request failed')

        const json = await res.json()
        const likeData = json.response.data.like

        // sync state
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== post.id) return p

            if (alreadyLiked) {
              // delete response. Removes like with matching id and alters like count
              return {
                ...p,
                like: p.like.filter((l) => l.userId !== userId),
                _count: { ...p._count, like: p._count.like - 1 }
              }
            } else {
              // create response with user obj
              return {
                ...p,
                like: [
                  ...p.like,
                  {
                    id: likeData.id,
                    userId: likeData.userId,
                    user: {
                      id: likeData.user.id,
                      firstName: likeData.user.firstName,
                      lastName: likeData.user.lastName,
                      avatar: likeData.user.avatar
                    }
                  }
                ],
                _count: { ...p._count, like: p._count.like + 1 }
              }
            }
          })
        )
      } catch (err) {
        // no manual rollback needed — optimisticPosts derives from posts,
        // and since setPosts never ran, optimistic UI reverts automatically
        console.error(err)
      }
    })
  }

  return (
    <>
      {optimisticPosts.map((post) => (
        <SinglePost key={post.id} post={post} onLike={handleLike} isPending={isPending} />
      ))}
    </>
  )
}

export default PostsList
