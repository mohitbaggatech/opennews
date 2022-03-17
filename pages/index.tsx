import type { NextPage } from 'next'
import { TopicView } from '../components/Topics' ;
import Annotations from '../components/Annotations';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {useRouter} from 'next/router'
import { useState } from 'react';
import { SearchForm } from './search';



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}




const Home: NextPage = () => {

  
  return (
    <>
    <SearchForm />
      <div className='flex w-full p-2 sm:p-0 flex-col flex-col-reverse sm:flex-row'>
          <div className="w-full sm:w-8/12 mt-5">
          <h1 className="text-3xl font-extralight text-gray-600 mb-10 sm:mt-5">Latest Stories</h1>
            <Annotations />
          </div>
          <div className="w-full sm:w-4/12 ml-2 sm:m-0">

            <TopicView />

          </div>
          </div>
          </>
  )
}

export default Home
