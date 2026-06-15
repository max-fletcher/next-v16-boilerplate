'use client'
import { TAuthType } from '@/constants/enums'
// import { Loader2 } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { Field } from '@base-ui-components/react/field'
import { LoginSchema, RegistrationSchema, TLoginData, TRegistrationData } from '@/lib/schema/authForm.schema'
import CustomInput from './CustomInput'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const AuthForm = ({ type }: { type: TAuthType }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { status } = useSession()

  // Redirect logged-in users away from this page
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/posts')
    }
  }, [status, router])

  type AuthFormType = TLoginData | TRegistrationData
  const isRegistration = type === TAuthType.REGISTRATION

  const formSchema = isRegistration ? RegistrationSchema : LoginSchema
  // 1. Define your form.
  const form = useForm<AuthFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: isRegistration
      ? {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        }
      : { email: '', password: '' }
  })

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null)
    setIsLoading(true)
    try {
      // Sign up or sign in using next-auth's signIn function
      console.log('Authform submit data', data)
      let res
      if (isRegistration) {
        const { firstName, lastName, email, password, confirmPassword } = data as TRegistrationData
        res = await signIn('credentials', {
          redirect: false,
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
          callbackUrl: '/posts'
        })
      } else {
        res = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
          callbackUrl: '/posts'
        })
      }

      // Navigate to homepage if logged in
      if (res?.ok) router.push(res?.url || '/dashboard')
      else throw new Error(res?.error || 'Invalid credentials')
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
      <header className="flex flex-col text-center">
        {/* auth logo */}
        <div className="max-w-[161px] mb-7 mx-auto">
          <Image className="object-cover w-full h-auto" src="/icons/logo.svg" width={1176} height={868} alt="Logo" />
        </div>
        {/* register content para */}
        <p className="font-normal leading-[1.4] mb-2">{isRegistration ? 'Get Started Now' : 'Welcome back'}</p>
        {/* register title */}
        <h4 className="text-[22px] mb-12.5">{isRegistration ? 'Registration' : 'Login to your account'}</h4>
        <Button className="bg-white border-1px border-background text-[13px] font-medium text-black px-15 py-5.5 mb-10">Register with google</Button>

        {/* <div
          className="
            relative 
            text-or-streak
            before:content-['']
            before:absolute
            before:left-0
            before:top-1/2
            before:w-[108px]
            before:h-[2px]
            before:bg-or-streak
            before:rounded-[6px]
            after:content-['']
            after:absolute
            after:right-0
            after:top-1/2
            after:w-[108px]
            after:h-[2px]
            after:bg-or-streak
            after:rounded-[6px]
          "
        >
          Or
        </div> */}

        <div className="flex items-center gap-4">
          <div className="h-[2px] flex-1 bg-or-streak" />
          <span className="text-or-streak font-medium">OR</span>
          <div className="h-[2px] flex-1 bg-or-streak" />
        </div>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        {isRegistration && (
          <>
            <CustomInput control={form.control} name="firstName" label="First Name" placeholder="Enter your first name" type="text" />
            <CustomInput control={form.control} name="lastName" label="Last Name" placeholder="Enter your last name" type="text" />
          </>
        )}
        <CustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" type="text" />
        <CustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" />

        <div className="flex flex-col gap-4">
          <Button type="submit" className="form-btn" disabled={isLoading}>
            {/* isLoading ? 
            (
              <>
                // Spinner/loader component. Comes from lucide-react. Got installed when we installed the sheet component from shadcn.
                <Loader2 size={20} className="animate-spin mr-2" />
                Loading...
              </>
            )
            :  */}
            Login now
          </Button>

          <Button type="button" className="form-btn" onClick={() => signIn('github', { callbackUrl: '/posts' })}>
            Sign in with GitHub
          </Button>
        </div>
      </form>

      <section>
        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">{!isRegistration ? "Don't have an account ?" : 'Already have an account ?'}</p>
          <Link href={isRegistration ? 'registration' : 'login'} className="form-link">
            {type === TAuthType.REGISTRATION ? 'Sign In' : 'Sign Up'}
          </Link>
        </footer>
      </section>
    </>
  )
}

export default AuthForm
