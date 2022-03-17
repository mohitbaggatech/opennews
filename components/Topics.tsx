import { useProgram } from '../composables/useWorkspace';
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from "react";
import orderBy from "lodash.orderby";
import { fetchTopics } from '../lib/fetch-topics';
import { connection } from "../pages/_app";
import { addTopic } from '../lib/add-topic';
import Link from 'next/link';
import DisplayStats from './stats';
import { addAnnotation } from '../lib/add-annotation';
import { Annotation } from '../models/Annotation';
import { Topic } from '../models/Topic';
import { WalletConnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import('tw-elements');
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';



export const TopicView = () => {
  const wallet: any = useAnchorWallet();
  const [topics, setTopics] = useState<unknown[]>([]);
  const [isLoading, setLoader] = useState<boolean>(false);
  const [addedTopic, setTopicSubmit] = useState<Topic>(undefined);
  const { program } = useProgram({ connection, wallet });

  useEffect(() => {
    fetchTopicsList();
  }, [program]);

  const fetchTopicsList = async () => {
    console.log("WALLET: ", wallet);
    console.log("Program: ", program);
    if (program) {
      // try {
      const topics = await fetchTopics({
        program,
        // topicFilter('solana'),
      });
      console.log("Topics", topics);
      setTopics(topics);
      // } catch (error) {
      //   console.log("ERROR: ", error);
      //   // set error
      // }
    }
  };

  const sendTopic = async () => {

    if (program) {
      // try {
      const topics = await fetchTopics({
        program,
        // topicFilter('solana'),
      });
      console.log("Topics", topics);
      setTopics(topics);
      // } catch (error) {
      //   console.log("ERROR: ", error);
      //   // set error
      // }
    }
  };



  const sortedTopics = orderBy(topics, ["timestamp"], ["desc"]);

  return (
    <div className='mr-3 sm:mr-5'>
      <div className="flex justify-between items-center mb-5 mt-5 sm:mt-10">
        <div className="max-w-7xl text-left">
          <h1 className="text-3xl font-extralight text-gray-600">Topic</h1>
        </div>

        <button type="button" className="inline-block rounded-full bg-violet-600 text-white leading-normal uppercase shadow-md hover:bg-violet-700 hover:shadow-lg focus:bg-violet-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-violet-800 active:shadow-lg transition duration-150 ease-in-out w-9 h-9" data-bs-toggle="collapse" data-bs-target="#addTopicCollapse" aria-expanded="false" aria-controls="addTopicCollapse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      <div className="collapse mb-10" id="addTopicCollapse">
          <AddTopicCard onSubmit={() => setLoader(true)} onError={()=> setLoader(false)} 
          onSuccess={(topic) => {
            setLoader(false);
            setTopicSubmit(topic);
          }} />
      </div>
      {isLoading ? 
      <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto mb-10">
  <div className="animate-pulse flex space-x-4">
    <div className="rounded-full bg-slate-300 h-10 w-10"></div>
    <div className="flex-1 space-y-6 py-1">
      <div className="h-2 bg-slate-300 rounded"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-slate-300 rounded col-span-2"></div>
          <div className="h-2 bg-slate-300 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-slate-300 rounded"></div>
      </div>
    </div>
  </div>
</div>
:
addedTopic && <AddedTopicWidget onAddNew={() => { } } addedTopic={addedTopic} />
      
      }
      <div className="rounded-lg bg-slate-50 p-5 dark:bg-slate-800">
          {/* <NetTweet onTweenSent={onTweenSent} /> */}
          {sortedTopics.map((t: any, index) => (
            <div className={`mb-5 pt-5 ${index == 0 ? "" : "border-t border-gray-200"}`} key={`topicCard${t.publicKey}`} >
              <TopicCard content={t} />
            </div>
          ))}
        </div>

      {/* <div className="text-xs">
        <h2 className="text-2xl font-semibold text-gray-400 mb-5">Recently Added</h2>
        
      </div> */}

    </div>);

}

export const TopicCard = ({ content, showStats = false }: any) => {
  return (
    <div className='x-full'>
      <div className="text-xl y-3 leading-7">
        <Link href={`/topic/${content.publicKey.toBase58()}`}>
          <a>{content.topic}</a>
        </Link>
      </div>
      <div className="flex content-between">
        <div className='grow'>
          {content.topic ? (
            <div className="text-blue-400 text-base">#{content.tag}</div>
          ) : null}
        </div>
        <div className='text-xs flex-row-reverse group-hover:flex hidden'>
          <div className="opacity-50">{content.createdAgo}</div>
          <div className="mx-2 opacity-50">·</div>
          <div className="font-semibold">{content.authorDisplay}</div>
        </div>
      </div>
      {showStats &&
        (<div className='group-hover:block hidden'>
          <DisplayStats allegations={content.allegations}
            support={content.support}
            against={content.against}
            showType={"sm"}

          />
        </div>)
      }
    </div>
  );
};


export const AddTopicCard = ({onSubmit, onSuccess, onError, setTopicSubmit} : any) => {
  const wallet: AnchorWallet = useAnchorWallet();
  const { program } = useProgram({ connection, wallet });
  return (
    <form
      // ref={formRef}
      onSubmit={(e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!wallet) {
          throw new WalletNotConnectedError();
        }
        const target = e.target as typeof e.target & {
          topic: { value: string };
          tag: { value: string };
        };
        const topic = target.topic.value; // typechecks!
        const tag = target.tag.value; // typechecks!
        const addedTopic = addTopic(topic, tag, wallet, program).then((topic: Topic) => {
          // setTopicSubmit(false);
          onSuccess(topic);
        }).catch((e) => {
          // setTopicSubmit(false);
          onError(e);
        });
        target.topic.value = "";
        target.tag.value = "";
        // setTopics([addedTopic, ...topics]);
      }}>
      <input type="text" name="topic" className="form-input 
                    mt-3
                    mb-3
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                    dark:bg-gray-800
                  "/>
      <div className='flex'>
        <div className='flex-none flex items-center mr-3'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <input type="text" name="tag" className="form-input
                    block
                    ml-2
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                    dark:bg-gray-800
                  "/>

        </div>
        {wallet && <div className='flex-auto'>
          
          <button className="w-full bg-violet-500 hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white"
          >Add</button>
          {/* } */}
        </div>}
      </div>
      {!wallet && 
      <div className='grid mt-3 justify-end'>
      <WalletMultiButton />
      </div>}
    </form>


  );
}

export const AddedTopicWidget = ({ addedTopic, onAddNew, action = "add" }) => {
  return (
    <div className='w-full'>
      <small className="block mt-1 text-base text-gray-600 mb-5 dark:text-gray-200">
        It usually take 2 minutes for data to get reflected. Meanwhile, you can check out your transaction on
        <a className='px-2 text-blue-500 hover:text-blue-700 text-base' href={`https://explorer.solana.com/address/${addedTopic.publicKey}/instructions?cluter=devnet`}>Solana Explorer</a>.
      </small>
      
        <div className="justify-center mb-10 p-3 block rounded-lg shadow-lg text-center card border-2 border-slate-200">
          <div className="py-3 px-3 flex justify-between items-center text-sm">
            <div>{addedTopic.authorDisplay}</div>
            <div>{addedTopic.createdAgo}</div>
          </div>
          <div className="p-2">
          <div className='flex items-center'>
                <svg className='w-4 h-4 mr-2 dark:fill-gray-300' viewBox="72.249 94.929 326.585 308.221" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 125.338 330.202 C 127.341 327.79 130.032 326.434 132.848 326.434 L 393.492 326.434 C 398.248 326.434 400.626 333.367 397.247 337.361 L 345.744 399.382 C 343.741 401.793 341.05 403.15 338.234 403.15 L 77.59 403.15 C 72.834 403.15 70.456 396.217 73.835 392.223 L 125.338 330.202 Z" />
                  <path d="M 125.338 98.697 C 127.341 96.285 130.032 94.929 132.848 94.929 L 393.492 94.929 C 398.248 94.929 400.626 101.862 397.247 105.856 L 345.744 167.802 C 343.741 170.213 341.05 171.57 338.234 171.57 L 77.59 171.57 C 72.834 171.57 70.456 164.637 73.835 160.643 L 125.338 98.697 Z" />
                  <path d="M 345.744 213.696 C 343.741 211.284 341.05 209.928 338.234 209.928 L 77.59 209.928 C 72.834 209.928 70.456 216.861 73.835 220.855 L 125.338 282.8 C 127.341 285.212 130.032 286.568 132.848 286.568 L 393.492 286.568 C 398.248 286.568 400.626 279.635 397.247 275.641 L 345.744 213.696 Z" />
                </svg>
                <div className='break-words truncate max-w-sm'>


                  <a href={`https://explorer.solana.com/address/${addedTopic.key}/instructions?cluster=devnet`} target={"_blank"} className='hover:text-blue-700 text-blue-400 text-sm' rel="noreferrer">{addedTopic.key}</a>
                </div>

              </div>
            {/* <h5 className="text-gray-900 text-xl font-medium mb-1">{addedTopic.snippet_type == 0 ? "Allegation" : addedTopic.snippet_type == 1 ? "Support" : "Against"}</h5> */}
            <p className="text-gray-700 text-base mb-2 dark:text-gray-100 pt-2">
              {addedTopic.topic}
            </p>
            <p className="text-blue-700 text-base dark:text-blue-400 ">
              <a rel="noreferrer" href={addedTopic.tag} target="_blank">#{addedTopic.tag}</a>
            </p>
          </div>
        </div>
      
    </div>);
}



