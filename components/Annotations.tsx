import useSWR from 'swr'
import * as anchor from "@project-serum/anchor";
import { useProgram } from '../composables/useWorkspace';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from "react";
import orderBy from "lodash.orderby";
import { getDomain } from 'tldts';
import { Connection, PublicKey } from "@solana/web3.js";
import { fetchMultipleTopics } from '../lib/fetch-topics';
import fetchAnnotations, { fetchMultipleAnnotations } from '../lib/annotations';
import { connection, defaultKey } from '../pages/_app';
import DisplayStats from './stats';
import Link from 'next/link';
import { addAnnotation, editAnnotation } from '../lib/add-annotation';
import { Annotation } from '../models/Annotation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';



const SOLANA_NEWS_PROGRAM = "BZzabrjKSxajzg345WeiKTBzNFsE4wDMeKMeasZo4WAb";
const programID = new PublicKey(SOLANA_NEWS_PROGRAM);




const Annotations = ({ filter_annotation }: any) => {
  const wallet: any = useAnchorWallet();
  // const [annotations, setAnnotation] = useState<unknown[]>([]);
  // const [topics, setTopics] = useState<Map<PublicKey, Topic>>();
  const [data, setData] = useState<Array<any>[]>([]);
  const { program } = useProgram({ connection, wallet });

  useEffect(() => {
    fetchAnnotationsList();
  }, [wallet, program]);

  const fetchAnnotationsList = async () => {
    console.log("WALLET: ", wallet);
    console.log("Program: ", program);
    if (program) {
      // try {
      const annotations = await fetchAnnotations({
        program,
        filter: filter_annotation ? [filter_annotation] : []
        // topicFilter('solana'),
      });
      console.log("Annotations", annotations);
      // setAnnotation(annotations);

      const topicPublicKeys = annotations.map((value, index) => value.parentTopic);

      const parentAnnotationKeys = annotations.map((value, index) => value.parent).filter((v, i) => !v.equals(defaultKey));

      console.log("topicPublicKeys", topicPublicKeys);

      console.log("parentAnnotationKeys", parentAnnotationKeys);

      // FETCHING ANNOTATION TOPICS

      const annotationTopics = await fetchMultipleTopics({
        program,
        listPubKeys: topicPublicKeys
      });

      console.log("annotationTopics", annotationTopics);

      // FETCHING PARENT ANNOTATION 

      const parentAnnotations = await fetchMultipleAnnotations({
        program,
        listPubKeys: parentAnnotationKeys
      });

      console.log("parentAnnotations", parentAnnotations);

      const data = annotations.map((v, i) => [v, annotationTopics[v.parentTopic.toBase58()], v.parent.equals(defaultKey) ? null : parentAnnotations[v.parent.toBase58()]]);



      console.log("data", data);
      setData(data);

      // } catch (error) {
      //   console.log("ERROR: ", error);
      //   // set error
      // }
    }
  };

  const sortedAnnotations = orderBy(data, d => d[0]["timestamp"], ["desc"]);

  console.log("sortedAnnotations", sortedAnnotations);

  return (<div>
    {/* <div className="flex flex-col items-center justify-center"> */}

    <div className="text-xs">
      {sortedAnnotations.map((t, i) => (
        <div className='mb-10 pb-10 border-b border-gray-200' key={`annotationCards${t[0].publicKey}`}>
          <AnnotationCard content={t[0]} topic={t[1]} parent_annotation={t[2]} isFeed={true} />
        </div>
      ))}
      {/* </div> */}
    </div>
  </div>);

}

const AnnotationUser = ({ content }: any) => {
  return (<div className="flex text-base subpixel-antialiased mb-2">
<Link href={`/user/${content.author.toBase58()}`}>
    <a className="font-bold opacity-40 hover:opacity-100">{content.authorDisplay}</a>
    </Link>
    <div className='px-2 opacity-50'> added </div>

    {content.snippet_type == 0 ? (
      <span className=" font-semibold text-violet-500">Allegation</span>
    ) : content.snippet_type == 1 ? (
      <span className=" font-semibold text-teal-500">Support</span>
    ) : (
      <span className=" font-semibold text-rose-500">Against</span>
    )}
    <div className="opacity-50 px-2">{content.createdAgo}</div>

  </div>);
}

const AnnotationCard = ({ content, topic, parent_annotation, isFeed = false }: any) => {
  console.log(content, topic, parent_annotation);
  if (!content) return (<div></div>);
  return (
    <div className={`w-full ${isFeed ? 'group' : ""}`}>
      {
        <div className={!isFeed ? "group-hover:block hidden" : ""}>
          <AnnotationUser content={content} />
        </div>
      }

      {/* ${content.snippet_type == 0 ? "group-hover:bg-violet-50" : content.snippet_type == 1 ? "group-hover:bg-emerald-50" : "group-hover:bg-rose-50"}  */}
      <div className={`pb-0 text-xl group-hover:text-2xl group-hover:leading-7`}>
        <div className={`${isFeed ? 'border-4 border-transparent pl-3 hover:border-l-transparent hover:rounded-lg group-hover:p-4 '.concat(content.snippet_type == 0 ? "border-l-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900" : content.snippet_type == 1 ? "border-l-emerald-300 hover:bg-emerald-50 dark:hover:bg-teal-900" : "border-l-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900") : ''}`}>
          <Link href={`/topic/${content.parentTopic.toBase58()}?a=${content.publicKey.toBase58()}&p=${content.parentAnnotation ? content.parentAnnotation.toBase58() : ""}`}>
            {content.annotation}
          </Link>
          <div className='group-hover:flex hidden justify-between items-center pt-2'>
            {
              !isFeed ?
                (<DisplayStats allegations={content.allegations} support={content.support} against={content.against} showType={"sm"} />

                )
                : (<div></div>)
            }
            {content.uri && (
              <a className="text-purple-400 text-sm" rel="noreferrer" target={"_blank"} href={content.uri}>{getDomain(content.uri)}</a>
            )}
          </div>
        </div>


        {parent_annotation != null &&
          (
            <div className='mt-2 pl-3 border-4 border-l-indigo-300 border-transparent hover:border-l-transparent hover:bg-indigo-50 group-hover:p-4 hover:rounded-lg dark:hover:bg-indigo-900'>
              {/* <div className='group-hover:hidden'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
              </svg>
              </div> */}
              <AnnotationCard content={parent_annotation} />
            </div>
          )
        }
        {topic != null &&
          (
            <div className='group-hover:p-5 mt-2  pl-3 border-4 border-l-cyan-300 border-transparent hover:border-l-transparent hover:bg-cyan-50 hover:rounded-lg hover:p-4 dark:hover:bg-cyan-900'>
              <TopicCard content={topic} showStats={true} />
            </div>
          )
        }

      </div>
    </div>
  );
};


export const TopicCard = ({ content, showStats = false }: any) => {
  return (
    <div className='x-full'>
      <div className="text-base subpixel-antialiased mb-2 group-hover:flex hidden">
        <div className="font-bold opacity-40 hover:opacity-100">{content.authorDisplay}</div>
        <div className='px-2 opacity-50'> added new </div>

        <span className=" font-semibold text-cyan-500">TOPIC</span>
        <div className="opacity-50 px-2">{content.createdAgo}</div>
      </div>
      <div className="y-3">
        <Link href={`/topic/${content.publicKey.toBase58()}`}>
          <a>{content.topic}</a>
        </Link>
      </div>
      <div className='flex sm:group-hover:flex sm:hidden justify-between items-center'>
        {/* <div className='grow'> */}

        {showStats &&
          (<div className='group-hover:block block sm:hidden'>
            <DisplayStats allegations={content.allegations} support={content.support} against={content.against} showType={"sm"} />
          </div>)
        }
        {content.topic ? (
          <div className="text-purple-400 text-sm">#{content.tag}</div>
        ) : null}
        {/* </div> */}
        {/* <div className='text-xs flex-row-reverse group-hover:flex hidden'>
          <div className="opacity-50">{content.createdAgo}</div>
          <div className="mx-2 opacity-50">·</div>
          <div className="font-semibold">{content.authorDisplay}</div>
        </div> */}
      </div>

    </div>
  );
};



export default Annotations;


export const AddAnnotationForm = ({ onSubmit, onSuccess, onError, onClose, snippetType, parentAnnotation, parentTopic, wallet, program, action = "add", oldAnnotation }: any) => {
  const [annotationSubmitting, setAnnotationSubmit] = useState(false);
  const [addedAnnotation, setAddedAnnotation] = useState<Annotation | undefined>();
  const [snippet, setSnippetType] = useState<number>(0);
  console.log("SNIPPET :: ", snippet, snippetType);

  useEffect(() => {
    setSnippetType(snippetType)
  }, [snippetType]);

  return (<div className='w-full h-full content-center grid'>

      <div className="block p-6 rounded-lg shadow-lg dark:shadow-2xl dark:brightness-200 bg-slate-100 dark:bg-black place-self-center">
        <div
          className="modal-header flex flex-shrink-0 items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-800 rounded-t-md">
          <h5 className={`text-xl font-medium leading-normal ${snippet == 0 ? "text-violet-600 " : snippet == 1 ? "text-emerald-600" : "text-rose-600"}`} id="exampleModalScrollableLabel">
            {action == "add" ? "Add" : "Edit"} {(snippet == 0 ? "Allegation " : snippet == 1 ? "Support" : "Against")}
          </h5>
          <button type="button"
            className="btn-close dark:btn-close-white box-content w-4 h-4 p-1 border-none rounded-none opacity-50 dark:opacity-20 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
            data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="true" aria-controls="collapseWidthExample" aria-label="Close"
            onClick={(e) => { setAddedAnnotation(undefined); onClose(); }}></button>
        </div>

        {parentAnnotation && <div className="flex justify-center mb-10 bg-slate-200 dark:bg-slate-800 w-full rounded-md">
          <div className="rounded-lg text-center w-full">
            <div className="py-3 px-3 flex justify-between items-center text-sm">
              <div className='flex justify-center items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" className="group-hover:stroke-2" strokeWidth={"1"} strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <Link href={`/user/${parentAnnotation.author.toBase58()}`}>
                  <a href="" className='hover:text-blue-700 text-blue-400'>{parentAnnotation.authorDisplay}</a>
                </Link>

              </div>

              <div>{parentAnnotation.createdAgo}</div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className='flex items-center'>
                <svg className='w-4 h-4 mr-2 dark:fill-gray-500' viewBox="72.249 94.929 326.585 308.221" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 125.338 330.202 C 127.341 327.79 130.032 326.434 132.848 326.434 L 393.492 326.434 C 398.248 326.434 400.626 333.367 397.247 337.361 L 345.744 399.382 C 343.741 401.793 341.05 403.15 338.234 403.15 L 77.59 403.15 C 72.834 403.15 70.456 396.217 73.835 392.223 L 125.338 330.202 Z" />
                  <path d="M 125.338 98.697 C 127.341 96.285 130.032 94.929 132.848 94.929 L 393.492 94.929 C 398.248 94.929 400.626 101.862 397.247 105.856 L 345.744 167.802 C 343.741 170.213 341.05 171.57 338.234 171.57 L 77.59 171.57 C 72.834 171.57 70.456 164.637 73.835 160.643 L 125.338 98.697 Z" />
                  <path d="M 345.744 213.696 C 343.741 211.284 341.05 209.928 338.234 209.928 L 77.59 209.928 C 72.834 209.928 70.456 216.861 73.835 220.855 L 125.338 282.8 C 127.341 285.212 130.032 286.568 132.848 286.568 L 393.492 286.568 C 398.248 286.568 400.626 279.635 397.247 275.641 L 345.744 213.696 Z" />
                </svg>
                <div className='break-words truncate max-w-sm'>


                  <a href={`https://explorer.solana.com/address/${parentAnnotation.key}/instructions?cluster=devnet`} target={"_blank"} className='hover:text-blue-700 text-blue-400 text-sm' rel="noreferrer">{parentAnnotation.key}</a>
                </div>

              </div>
              {/* <h5 className="text-gray-900 text-xl font-medium mb-1">{parentAnnotation.snippet_type == 0 ? "Allegation" : parentAnnotation.snippet_type == 1 ? "Support" : "Against"}</h5> */}
              <p className="text-gray-700 text-md mb-2 mt-4 dark:text-gray-500">
                {parentAnnotation.annotation}
              </p>
            </div>

          </div>
        </div>}
        {addedAnnotation ?
      <AddedAnnotationWidget addedAnnotation={addedAnnotation} action={action} onAddNew={() => setAddedAnnotation(undefined)} /> :
      (

        <form onSubmit={(e: React.SyntheticEvent) => {

          e.preventDefault();

          const target = e.target as typeof e.target & {
            url: { value: string };
            annotation: { value: string };
            annotation_type: { value: number };
            topic: { value: string };
            parent_annotation: { value: any };
          };
          const url = target.url.value; // typechecks!
          const annotation = target.annotation.value; // typechecks!
          const annotation_type = snippet; // typechecks!
          const topic = parentTopic;
          const parent_annotation = parentAnnotation;
          setAnnotationSubmit(false);
          onSubmit();
          if (action == "add") {
            addAnnotation(url, annotation, annotation_type, topic, parent_annotation, wallet, program).then((annotation: Annotation) => {
              setAnnotationSubmit(false);
              setAddedAnnotation(annotation);
              onSuccess(annotation);
            }).catch((e) => {
              setAnnotationSubmit(false);
              onError(e);
            });
          }
          else {
            // const old_annotation = oldAnnotation.publicKey;
            editAnnotation(url, annotation, annotation_type, oldAnnotation.parentTopic, oldAnnotation.parent, oldAnnotation.publicKey, wallet, program).then((annotation: Annotation) => {
              setAnnotationSubmit(false);
              setAddedAnnotation(annotation);
              onSuccess(annotation);
            }).catch((e) => {
              console.log("ERROR EDITING ANNOTATION : ", e);
              setAnnotationSubmit(false);
              onError(e);
            });

          }
          // setTopics([addedTopic, ...topics]);
        }}>
          <div className="form-group mb-6">
            <label className="form-label inline-block mb-2 text-gray-700">Web Article Link</label>
            <input type="url" name="url"
              defaultValue={oldAnnotation ? oldAnnotation.uri : ""}
              className="form-control
                  block
                  w-full
                  px-3
                  py-1.5
                  text-base
                  font-normal
                  text-gray-700
                  dark:text-gray-300
                  bg-white bg-clip-padding dark:bg-slate-900
                  border border-solid border-gray-300 dark:border-0
                  rounded
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="annotationURL"
              aria-describedby="urlHelp" placeholder="Enter URL" />
            <small id="urlHelp" className="block mt-1 text-xs text-gray-600">Copy paste article link to annotate from.</small>
          </div>

          <div className="form-group mb-6">
            <label className="form-label inline-block mb-2 text-gray-700">Annotation</label>
            <textarea
              name="annotation"
              defaultValue={oldAnnotation ? oldAnnotation.annotation : ""}
              // onChange={(event) => this.handleOnChange(event)}
              className="
                      form-control
                      block
                      w-full
                      px-3
                      py-1.5
                      text-base
                      font-normal
                      text-gray-700 dark:text-gray-300
                      bg-white bg-clip-padding dark:bg-slate-900
                      border border-solid border-gray-300 dark:border-0
                      rounded
                      transition
                      ease-in-out
                      m-0
                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                      "
              id="exampleFormControlTextarea1"
              rows={5}
              placeholder="Annotated text from web article"
            ></textarea>
            <small id="emailHelp" className="block mt-1 text-xs text-gray-600">Make sure your annotation text is copied text from above url that matches with the Annotation Type</small>
          </div>
          <div className="flex items-center justify-center">
            <div className="inline-flex" role="group">
              <button
                type="button"
                onClick={(e) => setSnippetType(0)}
                className={`
                      transition 
                      duration-150
                      ease-in-out
                      rounded-l
                      px-4
                      py-2
                      border-2 border-blue-600 dark:border-blue-700
                      font-medium
                      text-xs
                      leading-tight
                      uppercase ${snippet == 0 ? "text-white dark:text-gray-400 bg-blue-600 dark:bg-blue-700" : "hover:text-white dark:hover:text-gray-400 dark:hover:bg-blue-700 hover:bg-blue-600 hover:outline-none hover:ring-0 text-blue-600"}`}

              >
                Allegation
              </button>
              <button
                onClick={(e) => setSnippetType(1)}
                type="button"
                className={`
                          transition 
                          duration-150
                          ease-in-out

                          px-4
                          py-2
                          border-t-2 border-b-2 border-blue-600 dark:border-blue-700

                          font-medium
                          text-xs
                          leading-tight
                          uppercase ${snippet == 1 ? "text-white dark:text-gray-400 bg-blue-600 dark:bg-blue-700" : "hover:text-white dark:hover:text-gray-400 dark:hover:bg-blue-700 hover:bg-blue-600 hover:outline-none hover:ring-0 text-blue-600"}`}
              >
                Support
              </button>
              <button
                onClick={(e) => setSnippetType(2)}
                type="button"
                className={`
                      transition 
                      duration-150
                      ease-in-out
                      rounded-r
                      px-4
                      py-2
                      border-2 border-blue-600 dark:border-blue-700

                      font-medium
                      text-xs
                      leading-tight
                      uppercase ${snippet == 2 ? "text-white dark:text-gray-400 bg-blue-600 dark:bg-blue-700" : "hover:text-white dark:hover:text-gray-400 dark:hover:bg-blue-700 hover:bg-blue-600 hover:outline-none hover:ring-0 text-blue-600"}`}
              >
                Against
              </button>
            </div>
          </div>
          <div className='mt-10 w-full grid justify-items-center mb-5'>
            {wallet ?
            (<button type="submit" className="w-full inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">

              {annotationSubmitting ?
                <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                  Submitting ...
                </> : <>Submit</>}</button>)
                : 
                <>
                <div className='text-base mb-4'>
                  Connect your wallet to add an annotation 
                </div>
                <WalletMultiButton />
                </>}
          </div>
        </form>)}
      </div>
    </div>
  );
}

export const AddedAnnotationWidget = ({ addedAnnotation, onAddNew, action = "add" }) => {
  return (
    <div>
      <small className="block mt-1 text-base text-gray-600 mb-5">
        It usually take 2 minutes for data to get reflected. Meanwhile, you can check out your transaction on
        <a className='px-2 text-blue-500 hover:text-blue-700 text-base' href={`https://explorer.solana.com/address/${addedAnnotation.publicKey}/instructions`}>Solana Explorer</a>.
      </small>
      <div className='grid justify-center'>
      <div className={`block rounded-lg shadow-lg max-w-sm text-center justify-center mb-10 ${addedAnnotation.snippet_type == 0 ? "bg-violet-100 dark:bg-violet-900  dark:opacity-50" : addedAnnotation.snippet_type == 1 ? "bg-emerald-100 dark:bg-emerald-900 dark:opacity-50" : "bg-rose-100 dark:bg-rose-900 dark:opacity-50"}`}>

        <div className="p-4 flex justify-between items-center text-sm">
          <div>{addedAnnotation.authorDisplay}</div>
          <div>{addedAnnotation.createdAgo}</div>
        </div>
        <div className="p-4">
          <h5 className="text-gray-900 dark:text-gray-300 text-xl font-medium mb-1">{addedAnnotation.snippet_type == 0 ? "Allegation" : addedAnnotation.snippet_type == 1 ? "Support" : "Against"}</h5>
          <div className='flex items-center'>
                <svg className='w-4 h-4 mr-2 dark:fill-gray-300' viewBox="72.249 94.929 326.585 308.221" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 125.338 330.202 C 127.341 327.79 130.032 326.434 132.848 326.434 L 393.492 326.434 C 398.248 326.434 400.626 333.367 397.247 337.361 L 345.744 399.382 C 343.741 401.793 341.05 403.15 338.234 403.15 L 77.59 403.15 C 72.834 403.15 70.456 396.217 73.835 392.223 L 125.338 330.202 Z" />
                  <path d="M 125.338 98.697 C 127.341 96.285 130.032 94.929 132.848 94.929 L 393.492 94.929 C 398.248 94.929 400.626 101.862 397.247 105.856 L 345.744 167.802 C 343.741 170.213 341.05 171.57 338.234 171.57 L 77.59 171.57 C 72.834 171.57 70.456 164.637 73.835 160.643 L 125.338 98.697 Z" />
                  <path d="M 345.744 213.696 C 343.741 211.284 341.05 209.928 338.234 209.928 L 77.59 209.928 C 72.834 209.928 70.456 216.861 73.835 220.855 L 125.338 282.8 C 127.341 285.212 130.032 286.568 132.848 286.568 L 393.492 286.568 C 398.248 286.568 400.626 279.635 397.247 275.641 L 345.744 213.696 Z" />
                </svg>
                <div className='break-words truncate max-w-sm'>


                  <a href={`https://explorer.solana.com/address/${addedAnnotation.key}/instructions?cluster=devnet`} target={"_blank"} rel="noreferrer" className='hover:text-blue-700 text-blue-400 text-sm'>{addedAnnotation.key}</a>
                </div>

              </div>
          <p className="text-gray-700 text-base mb-2 dark:text-gray-100 pt-2">
            {addedAnnotation.annotation}
          </p>
          <p className="text-blue-500 text-sm mb-2 break-words">
            <a rel="noreferrer" href={addedAnnotation.uri} target="_blank">{addedAnnotation.uri}</a>
          </p>
        </div>

      </div>
      </div>

      <button onClick={(e) => onAddNew()} className="w-full inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
        {action == "add" ? "Add New" : "Ok"}</button>
    </div>);
}