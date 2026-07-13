import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { Field, FieldError } from './ui/field'
import { Input } from './ui/input'

interface IFeedPostInputProps<T extends FieldValues> {
  control: Control<T>
  // NOTE: "email" | "password" would work, but we will need to edit it on adding new fields. Hence, we are taking an inference of what this might be from authForm
  name: FieldPath<T>
  placeholder: string
  type?: string
  className?: string
}

const FeedPostInput = <T extends FieldValues>({ control, name, placeholder, type, className }: IFeedPostInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <Input
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            type={type}
            className="border-muted focus-visible:border-rest-blue h-12 shadow-none focus-visible:ring-0"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export default FeedPostInput
