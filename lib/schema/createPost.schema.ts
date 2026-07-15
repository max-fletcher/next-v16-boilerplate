import { z } from 'zod'

export const CreatePostSchema = z.object({
  body: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Body is required.' : 'Body must be a string.')
    })
    .nonempty({ error: 'Body is required.' }),
  image: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'Image must be under 5MB')
    .refine((file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Only JPEG, PNG, or WEBP images allowed')
})

export type TCreatePost = z.infer<typeof CreatePostSchema>
