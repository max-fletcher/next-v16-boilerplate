import { z } from 'zod'

export const CreatePostSchema = z.object({
  body: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Body is required.' : 'Body must be a string.')
    })
    .nonempty({ error: 'Body is required.' }),
  postId: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Post id is required.' : 'Post id be a string.')
    })
    .nonempty({ error: 'Post id is required.' }),
  userId: z
    .string({
      error: (issue) => (issue.input === undefined ? 'User id is required.' : 'User id be a string.')
    })
    .nonempty({ error: 'User id is required.' })
})

export type TCreatePost = z.infer<typeof CreatePostSchema>
