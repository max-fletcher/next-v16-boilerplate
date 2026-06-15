import AuthForm from '@/components/AuthForm'
import AuthCard from '@/components/AuthCard'
import { TAuthType } from '@/constants/enums'
import Image from 'next/image'

const Login = () => {
  return (
    <>
      {/* social_registration_wrapper */}
      <section className="py-[50px] md:py-[100px] flex justify-center align-center">
        <div className="max-w-[540px]  md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] grid grid-cols-3 gap-4 items-center p-3">
          <div className="col-span-3 lg:col-span-2">
            <Image className="object-cover w-full h-auto" src="/images/registration.png" width={1176} height={868} alt="registration image" />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <AuthCard>
              <AuthForm type={TAuthType.LOGIN} />
            </AuthCard>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
