'use client'
import SearchInput from '@/components/SearchInput'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import HomeIcon from './icons/Home'
import UserGroupIcon from './icons/UserGroup'
import BellIcon from './icons/Bell'
import SpeechBubbleIcon from './icons/SpeechBubble'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const Navbar = () => {
  const [searchText, setSearchText] = useState('')

  const pathname = usePathname()
  console.log('path', pathname)

  return (
    <>
      <div className="w-full h-20 bg-white flex items-center">
        <div className="mx-4 grid col-span-2">
          <Image className="w-40 h-20" src="/icons/logo.svg" width={150} height={150} alt="Logo" />
        </div>
        <div className="mx-4 flex items-center">
          <SearchInput searchText={searchText} setSearchText={setSearchText} name="search" placeholder="input search text" type="text" className="h-9" />
        </div>

        <ul className="flex jsutify-center items-center">
          <li className={cn(`px-4 py-7 mx-3 border-rest-blue`, pathname === '/posts' && 'border-b-3')}>
            <Link href={'/posts'} className="" aria-current="page">
              <HomeIcon isActive={pathname === '/posts'} />
            </Link>
          </li>
          <li className={cn(`px-4 py-7 mx-3 border-rest-blue`, pathname === '/friends' && 'border-b-3')}>
            <Link href={'/posts'} className="" aria-current="page">
              <UserGroupIcon isActive={pathname === '/friends'} />
            </Link>
          </li>
          <li className="px-4 py-7 mx-3 border-rest-blue relative">
            <span className="absolute top-6.5 right-4.5	 w-5 h-5 inline-flex justify-center items-center border border-white p-1 text-xs font-light text-white transform translate-x-1/2 -translate-y-1/2 bg-rest-blue rounded-full">
              6
            </span>
            <BellIcon />
          </li>
          <li className={cn(`px-4 py-7 mx-3 border-rest-blue relative`, pathname === '/chat' && 'border-b-3')}>
            <span className="absolute top-6.5 right-4.5	 w-5 h-5 inline-flex justify-center items-center border border-white p-1 text-xs font-light text-white transform translate-x-1/2 -translate-y-1/2 bg-rest-blue rounded-full">
              2
            </span>
            <Link href={'/posts'} aria-current="page">
              <SpeechBubbleIcon isActive={pathname === '/chat'} />
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Navbar
