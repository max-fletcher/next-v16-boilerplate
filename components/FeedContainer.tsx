'use client'
import ExploreMenu from '@/components/ExploreMenu'
import FeedPostForm from '@/components/FeedPostForm'
import PostsList from '@/components/PostsList'
import SideMenu from '@/components/SideMenu'
import { TComment, TPost } from '@/types/posts.types'
import { useSession } from 'next-auth/react'
import { useOptimistic, useState, useTransition } from 'react'

export enum PostActionsEnum {
  ADD_LIKE = 'add-like',
  REMOVE_LIKE = 'remove-like',
  ADD_POST = 'add-post',
  REMOVE_POST = 'remove-post',
  ADD_COMMENT = 'add-comment',
  REMOVE_COMMENT = 'remove-comment'
}

type PostAction =
  | { type: PostActionsEnum.ADD_LIKE; postId: string; like: TPost['like'][number] }
  | { type: PostActionsEnum.REMOVE_LIKE; postId: string; userId: string }
  | { type: PostActionsEnum.ADD_POST; post: TPost }
  | { type: PostActionsEnum.REMOVE_POST; postId: string }
  | { type: PostActionsEnum.ADD_COMMENT; postId: string; comment: TComment }
  | { type: PostActionsEnum.REMOVE_COMMENT; postId: string; commentId: string }

const FeedContainer = ({ initialPosts }: { initialPosts: TPost[] }) => {
  const [posts, setPosts] = useState<TPost[]>(initialPosts)
  const [isPending, startTransition] = useTransition()
  const { data: session } = useSession()

  const [optimisticPosts, applyOptimisticAction] = useOptimistic<TPost[], PostAction>(posts, (currentPosts, action) => {
    switch (action.type) {
      case PostActionsEnum.ADD_LIKE:
        return currentPosts.map((post) =>
          post.id === action.postId
            ? {
                ...post,
                like: [...post.like, action.like],
                _count: { ...post._count, like: post._count.like + 1 }
              }
            : post
        )
      case PostActionsEnum.REMOVE_LIKE:
        return currentPosts.map((post) =>
          post.id === action.postId
            ? {
                ...post,
                like: post.like.filter((l) => l.userId !== action.userId),
                _count: { ...post._count, like: post._count.like - 1 }
              }
            : post
        )
      case PostActionsEnum.ADD_POST:
        return [action.post, ...currentPosts] // attach new post at the front
      case PostActionsEnum.REMOVE_POST:
        return currentPosts.filter((p) => p.id !== action.postId)

      case PostActionsEnum.ADD_COMMENT:
        return currentPosts.map((post) =>
          post.id === action.postId
            ? {
                ...post,
                comments: [action.comment, ...post.comments],
                _count: {
                  ...post._count
                }
              }
            : post
        )
      case PostActionsEnum.REMOVE_COMMENT:
        return currentPosts.map((post) =>
          post.id === action.postId
            ? {
                ...post,
                comments: post.comments.filter((c) => c.id !== action.commentId),
                _count: {
                  ...post._count
                }
              }
            : post
        )

      default:
        return currentPosts
    }
  })

  function handleLike(post: TPost) {
    if (!session?.user) return

    const userId = session.user.id
    const alreadyLiked = post.like.some((l) => l.userId === userId)

    startTransition(async () => {
      // optimistic update
      if (alreadyLiked) {
        applyOptimisticAction({ type: PostActionsEnum.REMOVE_LIKE, postId: post.id, userId: userId })
      } else {
        applyOptimisticAction({
          type: PostActionsEnum.ADD_LIKE,
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
        // rollback — remove the optimistic like if it fails. Transition ends so no manual removal needed.
        console.error(err)
      }
    })
  }

  function handleCreatePost(body: string, image?: File | null) {
    if (!session?.user) return

    const tempId = `temp-${Date.now()}`

    const optimisticPost: TPost = {
      id: tempId,
      body,
      image: image ? URL.createObjectURL(image) : undefined, // using blob for local preview. Will delete below.
      createdAt: new Date().toISOString(),
      author: {
        id: session.user.id,
        firstName: session.user.firstName ?? '',
        lastName: session.user.lastName ?? '',
        email: session.user.email ?? '',
        avatar: session.user.avatar ?? ''
      },
      _count: { like: 0 },
      like: [],
      comments: []
    }

    startTransition(async () => {
      // optimistic insert
      applyOptimisticAction({ type: PostActionsEnum.ADD_POST, post: optimisticPost })

      try {
        const formData = new FormData()
        formData.append('body', body)
        formData.append('userId', session.user.id)
        if (image) formData.append('image', image)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts2`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`
          },
          body: formData
        })

        if (!res.ok) throw new Error('Failed to create post')

        const json = await res.json()
        const rawPost = json.response.data.post // extract post from response data

        const realPost: TPost = {
          ...rawPost,
          like: rawPost.like ?? [],
          _count: rawPost._count ?? { like: 0 }
        }

        setPosts((prev) => [realPost, ...prev]) // replace temp post with real post from backend
        if (optimisticPost.image) URL.revokeObjectURL(optimisticPost.image) // delete blob if exists
      } catch (err) {
        console.error(err)
        // rollback — remove the optimistic post if it fails. Transition ends so no manual removal needed.
      }
    })
  }

  function handleCreateComment(body: string, postId: string) {
    if (!session?.user) return

    const tempId = `temp-${Date.now()}`

    const optimisticComment: TComment = {
      id: tempId,
      postId,
      userId: session.user.id,
      body,
      user: {
        id: session.user.id,
        firstName: session.user.firstName ?? '',
        lastName: session.user.lastName ?? '',
        avatar: session.user.avatar ?? null
      }
    }

    startTransition(async () => {
      applyOptimisticAction({ type: PostActionsEnum.ADD_COMMENT, postId, comment: optimisticComment })

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.accessToken}`
          },
          body: JSON.stringify({ postId, body })
        })

        if (!res.ok) throw new Error('Failed to create comment')

        const json = await res.json()
        const realComment: TComment = json.response.data.comment

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [realComment, ...p.comments],
                  _count: {
                    ...p._count
                  }
                }
              : p
          )
        )
      } catch (err) {
        console.error(err)
        // rollback — remove the optimistic comment if it fails. Transition ends so no manual removal needed.
      }
    })
  }

  return (
    <>
      <div className="w-full grid grid-cols-12 gap-3 my-3">
        <div className="col-span-3 hidden lg:block">
          <SideMenu title="Explore">
            <ExploreMenu />
          </SideMenu>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <SideMenu>
            <FeedPostForm label="Write Someting" handleCreatePost={handleCreatePost} isPending={isPending} />
          </SideMenu>
          {posts.length > 0 && <PostsList optimisticPosts={optimisticPosts} handleLike={handleLike} handleCreateComment={handleCreateComment} isPending={isPending} />}
        </div>
        <div className="col-span-3 hidden lg:block">
          <SideMenu>
            <div>Left</div>
          </SideMenu>
        </div>
      </div>
    </>
  )
}

export default FeedContainer
