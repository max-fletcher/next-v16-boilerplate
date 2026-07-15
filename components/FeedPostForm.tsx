'use client'
import Image from 'next/image'
import { Controller, useForm } from 'react-hook-form'
import { CreatePostSchema, TCreatePost } from '@/lib/schema/createPost.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldLabel } from './ui/field'
import { cn } from '@/lib/utils'
import { Textarea } from './ui/textarea'
import PenIcon from './icons/Pen'
import PictureIcon from './icons/Picture'
import VideoIcon from './icons/Video'
import CalendarIcon from './icons/Calendar'
import NotepadIcon from './icons/Notepad'
import { Button } from './ui/button'
import PaperPlaneIcon from './icons/PaperPlane'
import { useRef } from 'react'
import { useSession } from 'next-auth/react'

export interface IFeedPostProps {
  label: string
  className?: string
  isPending: boolean
  handleCreatePost: (body: string, image?: File | null) => void
}

const FeedPostFormUploadItems = [
  {
    icon: <VideoIcon classes="mr-2" height={25} />,
    title: 'Video'
  },
  {
    icon: <CalendarIcon classes="mr-2" height={23} />,
    title: 'Event'
  },
  {
    icon: <NotepadIcon classes="mr-2" height={25} />,
    title: 'Articles'
  }
]

const FeedPostForm = ({ label, className, isPending, handleCreatePost }: IFeedPostProps) => {
  const { data: userSession } = useSession()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const form = useForm<TCreatePost>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      body: ''
    }
  })

  const onSubmit = async (data: TCreatePost) => {
    handleCreatePost(data.body, data.image)
    form.reset()
  }

  return (
    <>
      <div className="grid grid-cols-12">
        <Image
          className="col-span-1 min-w-10 mr-1 aspect-square rounded-full"
          src={userSession?.user.avatar ?? `/images/avatars/txt_img.png`}
          width={150}
          height={150}
          alt="Profile avatar"
        />
        <form id="create-post-form" onSubmit={form.handleSubmit(onSubmit)} className="w-full col-span-11">
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={cn(`relative`, className)}>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={3}
                  aria-invalid={fieldState.invalid}
                  placeholder={''} //Don't touch. Needs to be here else label disappears.
                  className="w-full peer h-26 pl-8 sm:pl-4 border-none shadow-none text-lg! resize-none focus-visible:border-rest-blue focus-visible:ring-0"
                />
                <FieldLabel
                  htmlFor={field.name}
                  className="
                    absolute left-3 top-3 text-md text-muted2 leading-[1.1] transition-all duration-300 pointer-events-none origin-top-left
                    peer-focus:scale-0 peer-focus:opacity-0
                    peer-not-placeholder-shown:scale-0 peer-not-placeholder-shown:opacity-0
                  "
                >
                  {label} ...
                  <PenIcon classes="-ml-2 -mb-1 bg-red" />
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="image"
            control={form.control}
            render={({ field: { onChange, name } }) => (
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                name={name}
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
              />
            )}
          />
        </form>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="grid grid-cols-12 justify-center items-center w-full rounded bg-[#1890ff0d] mt-2.5 px-4 h-auto pt-3 lg:pt-0">
          <button onClick={() => fileInputRef.current?.click()} disabled={isPending} className="flex justify-center items-center col-span-3 lg:col-span-2 text-muted2">
            <span>
              <PictureIcon classes="mr-2" height={25} />
            </span>
            <span className="hidden md:block lg:hidden xl:block">Photo</span>
          </button>
          {FeedPostFormUploadItems.map((FeedPostFormUploadItem) => (
            <button key={FeedPostFormUploadItem.title} className="flex justify-center items-center col-span-3 lg:col-span-2 text-muted2">
              <span>{FeedPostFormUploadItem.icon}</span>
              <span className="hidden md:block lg:hidden xl:block">{FeedPostFormUploadItem.title}</span>
            </button>
          ))}
          <span className="col-span-2 lg:col-span-1"></span>
          <Button type="submit" form="create-post-form" disabled={isPending} className="col-span-12 lg:col-span-3 items-center m-2 lg:max-w-xl xl:h-12 bg-[#377DFF]">
            <PaperPlaneIcon />
            Post
          </Button>
        </div>
      </div>
    </>
  )
}

export default FeedPostForm
