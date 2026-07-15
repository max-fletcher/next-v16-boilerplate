'use client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import HahaIcon from './icons/Haha'
import WordBalloonIcon from './icons/WordBalloon'
import ShareArrowIcon from './icons/ShareArrow'
import { TPost } from '@/types/posts.types'

type TSinglePostProps = {
  post: TPost
  onLike: (post: TPost) => void
  isPending: boolean
}

const SinglePost = ({ post, onLike, isPending }: TSinglePostProps) => {
  console.log('SinglePost', post, post.image)
  const { data: session } = useSession()

  const showLikeAvatarCount = 5
  const likedByUser = post.like.find((like) => like.user.id === session?.user.id)
  const likesWithAvatars = post.like.filter((like) => like.user.avatar)
  const displayedAvatars = likesWithAvatars.slice(0, showLikeAvatarCount)
  const remainingLikes = Math.max(0, post._count.like - displayedAvatars.length)

  return (
    <>
      <div>
        <div className="flex">
          <Image className="mr-1 w-14 h-14 aspect-square rounded-full" src="/images/avatars/txt_img.png" width={60} height={60} alt="Author avatar" />
          <div className="ml-3 mb-5">
            <h6 className="text-xl mb-1.5">
              {post.author.firstName} {post.author.firstName}
            </h6>
            <p className="text-[14px] text-muted2"> {post.createdAt} . Public</p>
          </div>
        </div>
        <div className="mb-5">{post.body}</div>
        {post.image && <Image className="w-full rounded-md mb-5" src={post.image} width={1000} height={1000} alt="Post image" />}

        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            {displayedAvatars.map((like, index) => (
              <Image
                key={like.id}
                src={like.user.avatar!}
                alt={`${like.user.firstName} ${like.user.lastName}`}
                width={60}
                height={60}
                className={cn(`w-12 h-12 border-4 border-white aspect-square rounded-full cursor-pointer`, index !== 0 ? '-ml-5' : '')}
              />
            ))}
            {remainingLikes > 0 && (
              <div
                className={cn(
                  `w-12 h-12 inline-flex justify-center items-center border-4 border-white p-1 text-lg font-light text-white transform bg-rest-blue rounded-full cursor-pointer`,
                  displayedAvatars.length > 0 && '-ml-5'
                )}
              >
                {remainingLikes}
                {displayedAvatars.length > showLikeAvatarCount && '+'}
              </div>
            )}
          </div>
          <div className="flex">
            <p className="mr-3 cursor-pointer">
              {12} <span className="text-muted3">Comments</span>
            </p>
            <p className="">
              12 <span className="text-muted3">Shares</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-9">
          <button
            onClick={() => onLike(post)}
            aria-disabled={isPending}
            className={cn(
              `col-span-3 flex justify-center items-center m-1 p-3 hover:bg-faint-blue delay-100 transition-call duration-200 ease-in-out cursor-pointer`,
              likedByUser && 'bg-faint-blue'
            )}
          >
            {likedByUser ? (
              <>
                <HahaIcon classes="mr-1" />
                Haha
              </>
            ) : (
              'Like'
            )}
          </button>
          <button
            className={cn(`col-span-3 flex justify-center items-center m-1 p-3 hover:bg-faint-blue delay-100 transition-call duration-200 ease-in-out cursor-pointer`)}
          >
            <WordBalloonIcon classes="mr-1" /> Comment
          </button>
          <button
            className={cn(`col-span-3 flex justify-center items-center m-1 p-3 hover:bg-faint-blue delay-100 transition-call duration-200 ease-in-out cursor-pointer`)}
          >
            <ShareArrowIcon classes="mr-1" /> Share
          </button>
        </div>
        <div></div>
      </div>
    </>
  )
}

export default SinglePost
