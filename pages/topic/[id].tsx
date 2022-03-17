import { useRouter } from 'next/router'
import Link from 'next/link'
// import 'tw-elements';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useProgram } from '../../composables/useWorkspace';
import { connection } from '../_app';
import { fetchTopicDetail } from '../../lib/fetch-topics';
import { annotationTopicFilter, fetchMultipleAnnotations, parentAnnotationFilter } from '../../lib/annotations';
import { PublicKey } from '@solana/web3.js';
import { orderBy } from 'lodash';
import { getDomain } from 'tldts';
import DisplayStats from '../../components/stats';
import { Annotation } from '../../models/Annotation';
import { addAnnotation } from '../../lib/add-annotation';
// import { toast, snackbar } from 'tailwind-toast';
import { AddAnnotationForm, AddedAnnotationWidget } from '../../components/Annotations';



const defaultKey = new PublicKey('11111111111111111111111111111111');



const TopicPage = () => {

    const router = useRouter();
    const { id } = router.query;
    const wallet: any = useAnchorWallet();
    const [showModal, setShowModal] = useState(false);
    // const [annotations, setAnnotation] = useState<unknown[]>([]);
    // const [topics, setTopics] = useState<Map<PublicKey, Topic>>();
    const [data, setData] = useState<any>({});
    const { program } = useProgram({ connection, wallet });
    const [snippet, setSnippetType] = useState<number>(0);
    const [parentAnnotation, setParentAnnotation] = useState<Annotation | undefined>();





    useEffect(() => {
        fetchTopicDetails();
    }, [id, program]);



    const addAnnotationModal = async (data, annotationType) => {
        console.log("ADD ANNOTATION : ", annotationType);
        setShowModal(true);
        // const annotationData = await addAnnotationData({
        //     program,
        //     data
        // });
        setSnippetType(annotationType);
        if (data && 'annotation' in data) {
            setParentAnnotation(data['annotation']);
        }
        else {
            setParentAnnotation(undefined);
        }

        // document.getElementById("#exampleModalScrollable").className
    }



    const fetchTopicDetails = async () => {
        console.log("WALLET: ", wallet);
        console.log("Program: ", program);
        if (program && id && data != undefined) {
            console.log("ID :: ", id);

            const topicDetails = await fetchTopicDetail({
                program,
                pubKey: new PublicKey(id)
            });
            console.log("Topic Details", topicDetails);
            setData(topicDetails);

        }
    };

    const isTabExpand = (publicK) => {
        return (router.query.a == publicK) || (router.query.p == publicK);
    }

    const topicD = data;

    console.log(topicD);
    console.log("SHOW MODAL => ", showModal);


    const AnnotationAccordian = ({ content, level = 0, index, accordianID }: any) => {

        // const router = useRouter();
        // const { id } = router.query;
        const [childAnnotationsLoad, loadChildAnnotations] = useState<boolean>(false);

        useEffect(() => {
            isTabExpand(content.publicKey.toBase58()) ? loadChildAnnotations(true) : null;
        }, []);



        return (<div className={`accordion-item rounded-lg dark:bg-transparent 
        border-t-${content.snippet_type == 0 ? 'violet' : content.snippet_type == 1 ? 'emerald' : 'rose'}-500${content.isEdited == 1 ? "/50" : ""}
        dark:border-t-${content.snippet_type == 0 ? 'violet' : content.snippet_type == 1 ? 'emerald' : 'rose'}-500${content.isEdited == 1 ? "/50" : ""}
        bg-white ${content.isEdited == 1 ? "opacity-40 hover:opacity-100" : ""}`}>
            <h2 className="accordion-header ml-3 mr-3 sm:m-0" 
                id={`heading${content.publicKey.toBase58()}`}>
                    <div key={`accordian${content.publicKey}`} id={`accordian${content.publicKey}`}>
                            {content.isEdited == 1 &&
                                <div className='px-4 py-2'>
                                    <div className='text-grey-500 flex'>
                                        Edited to <a
                                            // onClick={() => setGoToAnnotation(t.edited)}
                                            className='text-blue-500 px-2' href={`#accordian${content.edited.toBase58()}`}>{content.edited ? content.shortEditedKey : ""}</a> <span className=''> on </span>
                                        <div className='px-2'>{content.editedAt}</div>
                                    </div>

                                </div>}
                    </div>

                <button className={`accordion-button
                        relative
                        items-center
                        w-full
                        py-4
                        text-base text-gray-800 text-left dark:text-gray-200
                        bg-white
                        dark:bg-transparent
                        rounded-lg
                        transition
                        focus:outline-none ${isTabExpand(content.publicKey.toBase58()) ? "" : "collapsed"}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${content.publicKey.toBase58()}`}
                    aria-expanded={isTabExpand(content.publicKey.toBase58())} aria-controls={`collapse${content.publicKey.toBase58()}`} 
                         onClick={(e) => { e.preventDefault(); loadChildAnnotations(true);  }}>
                    <div>
                        <div className='antialiased text-xl mb-1'>{content.annotation}</div>
                    </div>
                    <div className="flex content-between y-2">
                        {content.uri ? (
                            <a className="text-purple-400 text-sm grow" href={content.uri}>{getDomain(content.uri)}</a>
                        ) : null}
                        <div className='flex-none'>
                            <div className="flex text-sm flex-row-reverse">
                                <div className="opacity-50 text-xs">{content.createdAgo}</div>
                                <div className="mx-2 opacity-50">·</div>
                                <div className="font-bold text-xs subpixel-antialiased">{content.authorDisplay}</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <DisplayStats allegations={content.allegations} support={content.support} against={content.against} showType={"sm"} onClickFunc={addAnnotationModal} data={{ "topic": topicD, "annotation": content }} />
                        {/* {content.snippet_type != 0 ? } */}
                    </div>

                </button>
            </h2>
{/* ${isTabExpand(content.publicKey.toBase58()) || childAnnotationsLoad ? "show" : ""}`} */}
            <div id={`collapse${content.publicKey.toBase58()}`} className={`accordion-collapse collapse`}
                 
                aria-labelledby={`heading${content.publicKey.toBase58()}`} data-bs-parent={accordianID}>



                <div className="accordion-body sm:p-5 bg-slate-50 dark:bg-gray-700">
                    <div className='pb-5'>
                        <div className='bg-slate-100 dark:bg-gray-800 py-3 sm:rounded-md shadow pl-5'>
                            <div className='flex items-center justify-start'>
                                <div className='flex items-center'>
                                <svg className='w-4 h-4 mr-2 dark:fill-gray-500' viewBox="72.249 94.929 326.585 308.221" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M 125.338 330.202 C 127.341 327.79 130.032 326.434 132.848 326.434 L 393.492 326.434 C 398.248 326.434 400.626 333.367 397.247 337.361 L 345.744 399.382 C 343.741 401.793 341.05 403.15 338.234 403.15 L 77.59 403.15 C 72.834 403.15 70.456 396.217 73.835 392.223 L 125.338 330.202 Z" />
                                    <path d="M 125.338 98.697 C 127.341 96.285 130.032 94.929 132.848 94.929 L 393.492 94.929 C 398.248 94.929 400.626 101.862 397.247 105.856 L 345.744 167.802 C 343.741 170.213 341.05 171.57 338.234 171.57 L 77.59 171.57 C 72.834 171.57 70.456 164.637 73.835 160.643 L 125.338 98.697 Z" />
                                    <path d="M 345.744 213.696 C 343.741 211.284 341.05 209.928 338.234 209.928 L 77.59 209.928 C 72.834 209.928 70.456 216.861 73.835 220.855 L 125.338 282.8 C 127.341 285.212 130.032 286.568 132.848 286.568 L 393.492 286.568 C 398.248 286.568 400.626 279.635 397.247 275.641 L 345.744 213.696 Z" />
                                </svg>
                                <a href={`https://explorer.solana.com/address/${content.key}/instructions?cluster=devnet`} target={"_blank"} className='hover:text-blue-700 text-blue-400 text-sm' rel="noreferrer">
                                        {content.key.slice(0, 10)}...
                                    </a>
                                    {/* <a href={`https://explorer.solana.com/address/${content.key}/instructions?cluster=devnet`} target={"_blank"} className='hover:text-blue-700 text-blue-400 text-sm hidden sm:block' rel="noreferrer">
                                        {content.key}
                                    </a> */}
                                </div>
                                <div className='flex items-center pl-5'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" className="group-hover:stroke-2" strokeWidth={"1"} strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <Link href={`/user/${content.author.toBase58()}`}>
                                    <a href="" className='hover:text-blue-700 text-blue-400'>{content.authorDisplay}</a>
                                </Link>
                                <div className='flex items-center pl-5'>

                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
</svg>
<a target={"_blank"} rel="noreferrer" className="hover:text-blue-700 text-blue-400" href={content.uri}>{getDomain(content.uri)}</a>
</div>
                                {/* <Link href={`/user/${content.author.toBase58()}`}>
                                    <a href="" className='hover:text-blue-700 text-blue-400 hidden sm:block'>{content.author.toBase58()}</a>
                                </Link> */}
                                </div>


                            </div>

                        </div>
                    </div>

                    {loadChildAnnotations && <GetAnnotations filterAttr="annotation" pubKey={content.publicKey.toBase58()} level={level} />}

                </div>
            </div>
        </div>);
    }


    const GetAnnotations = ({ filterAttr, pubKey, level = 0 }: any) => {
        const wallet: any = useAnchorWallet();
        const [data, setData] = useState<any>([]);
        const { program } = useProgram({ connection, wallet });
        const [goToAnnotation, setGoToAnnotation] = useState();

        // const jumpToAnnotation = (annotationID) => {
        //     setGoToAnnotation(annotationID);
        //     setTimeout(function () {
        //         this.setGoToAnnotation(undefined);
        //     }.bind(this), 3000);
        // }

        console.log("GET ANNOTATIONS FOR FILTER : ", filterAttr, pubKey);

        useEffect(() => {
            import('tw-elements');
            fetchAnnotationDetails();
        }, [program]);

        const fetchAnnotationDetails = async () => {
            console.log("WALLET: ", wallet);
            console.log("Program: ", program);
            if (program && data != undefined) {
                const annotations = await fetchMultipleAnnotations({
                    program,
                    filter: [filterAttr == "topic" ? annotationTopicFilter(pubKey) : parentAnnotationFilter(pubKey)]
                });
                console.log("Parent Annotations", annotations);

                setData(annotations);
            }
        };

        const sortedAnnotations = orderBy(data, d => d["timestamp"]);

        console.log("sortedAnnotations", sortedAnnotations);

        let sortedAllegations, supportAnnotations, againstAnnotation = [];

        if (filterAttr == "topic") {
            sortedAllegations = sortedAnnotations.filter((v: Annotation, i) => v.parent.toBase58() == defaultKey.toBase58());
            supportAnnotations = [];
            againstAnnotation = []
        }
        else {
            console.log("support / against Annotations", sortedAnnotations);
            sortedAllegations = sortedAnnotations.filter((v: Annotation, i) => v.snippet_type == 0);

            supportAnnotations = sortedAnnotations.filter((v: Annotation, i) => v.snippet_type == 1);
            againstAnnotation = sortedAnnotations.filter((v: Annotation, i) => v.snippet_type == 2);
        }



        return (
            <div className=''>
                {(supportAnnotations.length > 0 || againstAnnotation.length > 0) &&
                    <div className={`mb-20 sm:mb-5 grid grid-cols-1 ${level > 1 ? "sm:grid-cols-1" : "sm:grid-cols-2 gap-4"}  `}>
                        <div className=''>
                            {supportAnnotations.length > 0 &&
                                <div className='font-bold text-emerald-600 dark:text-emerald-300 text-center antialiased opacity-30 dark:opacity-60 pb-2'>
                                    SUPPORT
                                </div>}
                            {supportAnnotations.map((t, i) => (
                                // <div className='border-2 border-t-emerald-500 mb-5' key={`support${t.publicKey}`}>
                        //         <div className={`${filterAttr != "topic" ? "border-2 dark:border-transparent" : "mt-2"} 
                        // ${t.isEdited == 1 ? " border-t-emerald-500/50  dark:border-t-emerald-500/50" : " border-t-emerald-500 dark:border-t-emerald-500 "}
                        // ${goToAnnotation && goToAnnotation == t.publicKey ? "animate-[bounce_1s]" : ""}`} key={`accordian${t.publicKey}`} id={`accordian${t.publicKey}`}>
                        //             {t.isEdited == 1 &&
                        //                 <div className='px-4 py-2'>
                        //                     <button className='text-grey-500 flex -m-b-5' onClick={() => setGoToAnnotation(t.edited.toBase58())}>
                        //                         Edited to <a className='text-blue-500 px-2' href={`#accordian${t.edited.toBase58()}`}>{t.edited ? t.shortEditedKey : ""}</a> <span className=''> on </span>
                        //                         <div className='px-2'>{t.editedAt}</div>
                        //                     </button>

                        //                 </div>}

                                    <AnnotationAccordian content={t} level={level + 1} index={i} key={`accordian${t.publicKey}`} accordianID={`#accordian${pubKey}`} />
                                
                            ))}
                        </div>

                        <div className=''>
                            {againstAnnotation.length > 0 &&
                                <div className='font-bold text-rose-600 dark:text-rose-300 text-center antialiased opacity-30 dark:opacity-60 pb-2'>
                                    AGAINST
                                </div>}
                            {againstAnnotation.map((t, i) => (
                                // <div className='border-2 border-t-rose-500 mb-5' key={`against${t.publicKey}`}>
                        //         <div className={`${filterAttr != "topic" ? "border-2 dark:border-transparent" : "mt-2"} 
                        // ${t.isEdited == 1 ? " border-t-rose-500/50  dark:border-t-rose-500/50" : " border-t-rose-500  dark:border-t-rose-500"}
                        // ${goToAnnotation && goToAnnotation == t.publicKey ? "animate-[bounce_1s]" : ""}`} key={`accordian${t.publicKey}`} id={`accordian${t.publicKey}`}>
                        //             {t.isEdited == 1 &&
                        //                 <div className='px-4 py-2'>
                        //                     <button className='text-grey-500 flex -m-b-5' onClick={() => setGoToAnnotation(t.edited.toBase58())}>
                        //                         Edited to <a
                        //                             className='text-blue-500 px-2' href={`#accordian${t.edited.toBase58()}`}>{t.edited ? t.shortEditedKey : ""}</a> <span className=''> on </span>
                        //                         <div className='px-2'>{t.editedAt}</div>
                        //                     </button>

                        //                 </div>}

                                    <AnnotationAccordian content={t} level={level + 1} index={i} key={`accordian${t.publicKey}`} accordianID={`#accordian${pubKey}`} />
                                // </div>
                            ))}
                        </div>
                    </div>
                }

                <div>
                    {sortedAllegations.length > 0 && filterAttr != "topic" &&
                        <div className='font-bold text-violet-600 dark:text-violet-300 text-center antialiased opacity-30 dark:opacity-60 pb-2'>
                            SUB ALLEGATIONS
                        </div>}
                        <div className="accordion accordion-flush" id={`accordian_allegation_${pubKey}`}>
                    {sortedAllegations.map((t, i) => (
                        
                            
                            <AnnotationAccordian content={t} level={level + 1} index={i} key={`accordian${t.publicKey}`} accordianID={`#accordian_allegation_${pubKey}`} />
                            
                        
                    ))}
                    </div>
                </div>
            </div>
        )
    }

    const closeModal = () => {
        setShowModal(false);
    }





    return (
        <>
            <nav className="bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-md mt-5 ml-2 sm:ml-0 mr-10 max-w-10/12 text-ellipsis truncate">
                <ol className="list-reset flex">
                    <li><Link href="/"><a href="" className="text-blue-600 dark:text-white hover:text-blue-700">Topics</a></Link></li>
                    <li><span className="text-gray-500 dark:text-white mx-2">/</span></li>
                    <li className="text-gray-500 dark:text-gray-400">{id}</li>
                </ol>
            </nav>

            <div className='mt-4 sm:mt-10 mb-20'>
                <div className='sm:mr-10'>
                    <div className='ml-3 mr-3 sm:m-0'>


                        <a href={`https://explorer.solana.com/address/${id}/instructions?cluster=devnet`} target={"_blank"} rel="noreferrer">
                            <h2 className="font-medium break-words leading-tight text-1sm mt-0 mb-2 text-violet-400 font-extralight hover:font-bold">
                                
                                {id}
                                
                            </h2>
                        </a>
                        <h1 className="font-medium break-words leading-tight text-3xl mt-0 mb-2 text-black-600">{topicD?.topic ?? ""}</h1>

                        <div className="flex topicD-between mb-10 sm:mb-4">
                            <div className='grow'>
                                {topicD?.tag ? (
                                    <div className="text-purple-400 text-base hover:text-lg hover:font-bold">
                                        <Link href={`/search?q=${topicD?.tag}`}><a>
                                            #{topicD?.tag}
                                        </a>
                                        </Link>
                                    </div>
                                ) : null}
                            </div>
                            <div className='flex text-xs flex-row-reverse'>
                                <div className="opacity-50">{topicD?.createdAgo}</div>
                                <div className="mx-2 opacity-50">·</div>
                                <Link href={`/user/${topicD?.author?.toBase58()}`}>
                                    <a className="font-semibold text-blue-500">
                                    
                                    {topicD?.authorDisplay}</a>
                                    </Link>
                            </div>
                        </div>

                        <DisplayStats allegations={topicD?.allegations} support={topicD?.support} against={topicD?.against} showType={"lg"} onClickFunc={addAnnotationModal} data={{ "topic": topicD }} />
                    </div>
                    {id &&
                        <div className='m-0 sm:mt-10'>
                            <GetAnnotations filterAttr={"topic"} pubKey={id} /></div>}

                    {/* {modalContent} */}

                </div>
                {/* <div className=''> */}
                <div className={`z-40 overflow-scroll fixed top-0 bottom-0 right-0 w-11/12 sm:w-4/12 collapse collapse-horizontal ${showModal ? "show" : ""}`} id="collapseWidthExample">

                    <AddAnnotationForm onSubmit={() => { }}
                        onSuccess={(annotation) => {
                            // const addedAnnotation = annotation;
                            // console.log("Added Annotation => ", addedAnnotation);
                            // setAddedAnnotation(addedAnnotation);
                        }}
                        onError={(error) => {
                            console.log(error);
                            // snackbar().danger('Error!', error);
                        }}
                        onClose={() => { closeModal(); }}
                        setSnippetType={(changed_snippet) => setSnippetType(changed_snippet)}
                        snippetType={snippet}
                        parentAnnotation={parentAnnotation}
                        parentTopic={id}
                        wallet={wallet}
                        program={program}
                    />



                    {/* </div>
                    {/* </div> */}
                    {/* </div> */}
                </div>
            </div>
        </>
    )


}



export default TopicPage;


