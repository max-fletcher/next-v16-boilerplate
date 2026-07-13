import ExploreMenu from '@/components/ExploreMenu'
import FeedPostForm from '@/components/FeedPostForm'
import Navbar from '@/components/Navbar'
import SideMenu from '@/components/SideMenu'

const page = () => {
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
