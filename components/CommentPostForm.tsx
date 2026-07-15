'use client'
import Image from 'next/image'
import { Controller, useForm } from 'react-hook-form'
import { CreatePostSchema, TCreatePost } from '@/lib/schema/createPost.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Field, FieldError, FieldLabel } from './ui/field'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Textarea } from './ui/textarea'
import PenIcon from './icons/Pen'
import { Button } from './ui/button'
import PaperPlaneIcon from './icons/PaperPlane'

export interface IFeedPostInputProps {
  label: string
  className?: string
}

const CommentPostForm = ({ label, className }: IFeedPostInputProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { data: userData } = useSession()

  const form = useForm<TCreatePost>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      body: ''
    }
  })

  const onSubmit = async (data: TCreatePost) => {
    setError(null)
    setIsLoading(true)
    try {
      console.log('create post submit 1', data)

      const { body } = data
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: body
        })
      })

      console.log('create post submit responses', res)
      // Navigate to homepage if logged in
      if (res?.ok) router.push(res?.url || '/posts')
      else throw new Error('Error submitting post.')
      //   else throw new Error(res?.error || 'Invalid credentials')
    } catch (error: unknown) {
      // console.log('onSubmit error', error)

      if (error instanceof Error) {
        setError(error.message?.replace(/^Error:\s*/, '') || 'Something went wrong')
      } else {
        setError('Something went wrong')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-12">
        <Image className="col-span-1 min-w-10 mr-1 aspect-square rounded-full" src="/images/avatars/txt_img.png" width={150} height={150} alt="Profile avatar" />
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
        </form>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="grid grid-cols-12 justify-center items-center w-full rounded bg-[#1890ff0d] mt-2.5 px-4 h-auto pt-3 lg:pt-0">
          {FeedPostFormUploadItems.map((FeedPostFormUploadItem, index) => (
            <div key={index} className="flex justify-center items-center col-span-3 lg:col-span-2 text-muted2">
              <span>{FeedPostFormUploadItem.icon}</span>
              <span className="hidden md:block lg:hidden xl:block">{FeedPostFormUploadItem.title}</span>
            </div>
          ))}
          <span className="col-span-2 lg:col-span-1"></span>
          <Button type="submit" form="create-post-form" disabled={isLoading} className="col-span-12 lg:col-span-3 items-center m-2 lg:max-w-xl xl:h-12 bg-[#377DFF]">
            <PaperPlaneIcon />
            Post
          </Button>
        </div>
      </div>
    </>
  )
}

export default CommentPostForm
