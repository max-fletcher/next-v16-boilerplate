import AuthCard from '@/components/AuthCard'
import AuthForm from '@/components/AuthForm'
import { TAuthType } from '@/constants/enums'
import Image from 'next/image'

// export default signIn

const Registration = () => {
  return (
    <>
      <section className="py-12.5 md:py-25 flex justify-center align-center">
        <div className="max-w-135  md:max-w-180 lg:max-w-240 xl:max-w-285 2xl:max-w-330 grid grid-cols-3 gap-4 md:gap-8 items-center p-3">
          <div className="col-span-3 lg:col-span-2">
            <div className="max-w-165.75"></div>
            <Image className="object-cover w-auto h-auto" src="/images/registration.png" width={1176} height={868} alt="registration image" />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <AuthCard>
              <AuthForm type={TAuthType.REGISTRATION} />
            </AuthCard>
          </div>
        </div>
      </section>
    </>
  )
}

export default Registration
