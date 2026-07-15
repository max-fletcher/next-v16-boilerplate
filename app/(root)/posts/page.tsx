import { auth } from '@/auth'
import FeedContainer from '@/components/FeedContainer'
import Navbar from '@/components/Navbar'
import { TPost } from '@/types/posts.types'

const page = async () => {
  const session = await auth()
  const accessToken = session?.user.accessToken

  // Define your parameters as an object
  const params = {
    page: '1',
    limit: '100',
    orderBy: 'createdAt',
    order: 'desc'
  }
  // Convert object to query string: "category=electronics&limit=10&search=smart+watch"
  const queryString = new URLSearchParams(params).toString()

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts2/query?${queryString}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  }).then((r) => r.json())
  // console.log('posts111', posts)
  const posts = data.response.data.paginatedPosts.posts as TPost[]

  return (
    <>
      <Navbar />
      <div className="px-2 lg:px-10 xl:px-16 min-[1400px]:px-28!">
        <FeedContainer initialPosts={posts} />
      </div>
    </>
  )
}

export default page
