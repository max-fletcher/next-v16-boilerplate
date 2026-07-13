import Image from 'next/image'
import FeedPostInput from './FeedPostInput'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

export interface IFeedPostInputProps<T extends FieldValues> {
  control: Control<T>
  // NOTE: "email" | "password" would work, but we will need to edit it on adding new fields. Hence, we are taking an inference of what this might be from authForm
  name: FieldPath<T>
  placeholder: string
  type?: string
  className?: string
}

const FeedPostForm = <T extends FieldValues>({ control, name, placeholder, type, className }: IFeedPostInputProps<T>) => {
  return (
    <>
      <Image className="w-10 mr-1 rounded-full" src="/images/avatars/people1.png" width={150} height={150} alt="Profile avatar" />
      <FeedPostInput control={control} name={name} placeholder={placeholder} type={type} className={className} />
    </>
  )
}

export default FeedPostForm
