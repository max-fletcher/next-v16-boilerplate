import { auth } from '@/auth'
import ExploreMenu from '@/components/ExploreMenu'
import FeedPostForm from '@/components/FeedPostForm'
import Navbar from '@/components/Navbar'
import PostsList from '@/components/PostsList'
import SideMenu from '@/components/SideMenu'

const page = async () => {
  const session = await auth()
  const accessToken = session?.user.accessToken
  console.log('session111', session)
  console.log('accessToken111', session?.user.accessToken)

  const posts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts2/query`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  }).then((r) => r.json())
  // console.log('posts111', posts)

  return (
    <>
      <Navbar />
      <div className="px-2 lg:px-10 xl:px-16 min-[1400px]:px-28!">
        <div className="w-full grid grid-cols-12 gap-3 my-3">
          <div className="col-span-3 hidden lg:block">
            <SideMenu title="Explore">
              <ExploreMenu />
            </SideMenu>
            <SideMenu title="Explore">
              <ExploreMenu />
            </SideMenu>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <SideMenu>
              <FeedPostForm label="Write Someting" />
            </SideMenu>
            <SideMenu>
              <PostsList initialPosts={posts.response.data.paginatedPosts.posts} />
            </SideMenu>
          </div>
          <div className="col-span-3 hidden lg:block">
            <SideMenu>
              <div>Left</div>
            </SideMenu>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
