const AuthCard = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      {/* social_registration_content */}
      <section className="bg-white p-12 rounded-md mt-[15px] lg:mt-0">{children}</section>
    </>
  )
}

export default AuthCard
