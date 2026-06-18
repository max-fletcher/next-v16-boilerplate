import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'

interface ICustomInputProps<T extends FieldValues> {
  control: Control<T>
  // NOTE: "email" | "password" would work, but we will need to edit it on adding new fields. Hence, we are taking an inference of what this might be from authForm
  name: FieldPath<T>
  label: string
  placeholder: string
  type?: string
  autoComplete?: string
}

const CustomInput = <T extends FieldValues>({ control, name, label, placeholder, type, autoComplete }: ICustomInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name} className="text-base font-medium text-custom-label leading-[1.4]">
            {label}
          </FieldLabel>
          <Input
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            type={type}
            autoComplete={autoComplete}
            className="border-muted focus-visible:border-rest-blue h-12 shadow-none focus-visible:ring-0"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export default CustomInput
