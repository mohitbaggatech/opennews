import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from 'next/image'
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";



export default function Menu() {
  const { theme, setTheme } = useTheme();
  const wallet = useAnchorWallet();
  const router = useRouter();
  console.log("PATH : ", router.pathname);
  return (
    // <div className="grid grid-cols-8 mr-10 ml-10">
    <div className='w-full sm:w-3/12 sm:fixed z-50 top-0 sm:top-5 mt:pt-5 justify-between p-2 flex sm:flex-col items-center'>
      
        
      <Link href="/">
      <div className="flex justify-center items-center  mt-3">
      <Image src="/logo.png" width={40} height={40} layout="fixed" className="shadow-lg" quality={100} />
      <h1 className="ml-5 text-xl">OPEN NEWS</h1>
      </div>
      </Link>

      <div className="hidden sm:inline-block sm:mt-10">
        <div className="h-10 flex">
          <Link href="/">
            <a href="" className='flex items-center group'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-2" strokeWidth={router.pathname == '/' ? "2" : "1"} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className={`mx-auto text-2xl cursor-pointer pl-4 font-extralight group-hover:font-medium ${router.pathname == '/' ? "font-medium" : ""}`}>Home</span></a>
          </Link>
        </div>
        <div className="h-10 mt-3 flex">
        <Link href="/search?q=">
          <a href="" className='flex items-center group'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" className="group-hover:stroke-2" strokeLinejoin="round" strokeWidth={router.pathname.includes('/search')  ? "2" : "1"} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span className={`mx-auto text-2xl cursor-pointer pl-4 font-extralight group-hover:font-medium ${router.pathname.includes('/search') ? "font-medium" : ""}`}>Explore</span></a>
          </Link>
        </div>
    
        <div className="h-10 mt-3 flex">
        <Link href="/me">
          <a href="" className='flex items-center group'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" className="group-hover:stroke-2" strokeWidth={router.pathname.includes('/me')  ? "2" : "1"} strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className={`mx-auto text-2xl cursor-pointer pl-4 font-extralight group-hover:font-medium ${router.pathname.includes('/me') ? "font-medium" : ""}`}>Profile</span></a>
            </Link>
        </div>
        <div className="h-10 mt-3 flex">

          <button
            aria-label="Toggle Dark Mode"
            type="button"
            className="flex"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {
              theme === 'dark' ?
              (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>)
              :
              (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>)
            }
          <span className="mx-auto text-2xl cursor-pointer pl-4 font-extralight">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        <div className='mt-5'>
          <WalletMultiButton className="wallet-adapter-button-trigger" />
        </div>
      </div>
      <div className="sm:hidden flex">
        {wallet &&
        (<Link href="/me">
          <a href="" className='flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="mx-auto text-sm cursor-pointer pl-4 font-extralight">Profile</span>
            </a>
            </Link>)}

<div className="flex">

          <button
            aria-label="Toggle Dark Mode"
            type="button"
            className="flex"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {
              theme === 'dark' ?
              (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>)
              :
              (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>)
            }
          <span className="mx-auto text-xl cursor-pointer pl-2 pr-2 font-extralight">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      <div className="rounded-lg p-4 ml-12 mr-12 mt-20 hidden sm:block border-2 border-grey-400 text-gray-600">
            <h3 className="font-bold text-2xl flex items-center ">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
              Devnet</h3>
            <p className="mt-3">
              Change your Network to Devnet to add Topic / Annotation. 
            </p>
            <h4 className="font-semibold mt-5 mb-2">Need SOLs ?</h4>
            <p>
            Get SOLs <a href="https://solfaucet.com/" target="_blank" rel="noreferrer" className="text-blue-400 text-xl">here</a>
            </p>
      </div>
      {/* </div> */}
    </div>);
}