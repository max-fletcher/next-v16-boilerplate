import { z } from 'zod'

export const CreateCommentSchema = z.object({
  body: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Body is required.' : 'Body must be a string.')
    })
    .nonempty({ error: 'Body is required.' })
})

export type TCreatePost = z.infer<typeof CreateCommentSchema>
