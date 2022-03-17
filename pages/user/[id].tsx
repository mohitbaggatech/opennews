import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletConnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { orderBy } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDomain } from "tldts";
import Annotations, { AddAnnotationForm, AddedAnnotationWidget } from "../../components/Annotations";
import DisplayStats from "../../components/stats";
import { useProgram } from "../../composables/useWorkspace";
import fetchAnnotations, { annotationAuthorFilter, annotationTopicFilter, fetchMultipleAnnotations } from "../../lib/annotations";
import fetchTopics, { fetchMultipleTopics, topicAuthorFilter, topicFilter } from "../../lib/fetch-topics";
import { Annotation } from "../../models/Annotation";
import { connection, defaultKey } from "../_app";
// import { toast, snackbar } from 'tailwind-toast';
import { AddedTopicWidget, AddTopicCard } from "../../components/Topics";
import { Topic } from "../../models/Topic";


const preventDefault = f => e => {
    e.preventDefault()
    f(e)
}

export default function UserPage() {

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        import('tw-elements');
    }, []);

    return (
        <>
        <nav className="bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-md mt-5 ml-2 sm:ml-0 mr-10 max-w-10/12 text-ellipsis truncate">
                <ol className="list-reset flex">
                    <li><Link href="/"><a href="" className="text-blue-600 dark:text-white hover:text-blue-700">User</a></Link></li>
                    <li><span className="text-gray-500 dark:text-white mx-2">/</span></li>
                    <li className="text-gray-500 dark:text-gray-400">{id}</li>
                </ol>
            </nav>
            <ul className="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4 mt-5" id="tabs-tab3"
                role="tablist">
                <li className="nav-item" role="presentation">
                    <a href="#tabs-home3" className="
                            nav-link
                            w-full
                            block
                            font-medium
                            text-base
                            leading-tight
                            uppercase
                            border-x-0 border-t-0 border-b-2 border-transparent
                            px-6
                            py-3
                            my-2
                            hover:border-transparent hover:bg-gray-100
                            focus:border-transparent
                            active
                            " id="tabs-home-tab3" data-bs-toggle="pill" data-bs-target="#tabs-home3" role="tab" aria-controls="tabs-home3"
                        aria-selected="true">Annotations</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a href="#tabs-profile3" className="
                            nav-link
                            w-full
                            block
                            font-medium
                            text-base
                            leading-tight
                            uppercase
                            border-x-0 border-t-0 border-b-2 border-transparent
                            px-6
                            py-3
                            my-2
                            hover:border-transparent hover:bg-gray-100
                            focus:border-transparent
                            " id="tabs-profile-tab3" data-bs-toggle="pill" data-bs-target="#tabs-profile3" role="tab"
                        aria-controls="tabs-profile3" aria-selected="false">Topics</a>
                </li>
            </ul>
            <div className="tab-content" id="tabs-tabContent3">
                <div className="tab-pane fade show active" id="tabs-home3" role="tabpanel" aria-labelledby="tabs-home-tab3">
                    <UserAnnotations />
                </div>
                <div className="tab-pane fade" id="tabs-profile3" role="tabpanel" aria-labelledby="tabs-profile-tab3">
                    <UserTopics />
                </div>
            </div>
        </>);
}


export function UserAnnotations() {
    const router = useRouter();
    const { id } = router.query;
    const wallet: any = useAnchorWallet();
    const [annotations, setAnnotation] = useState(undefined);
    const [topics, setTopics] = useState(undefined);
    const { program } = useProgram({ connection, wallet });
    const [isLoading, setLoading] = useState<boolean>(false);
    const [showEditDialog, setshowEditDialog] = useState<boolean>(false);
    const [editAnnotation, setAnnotationEdit] = useState(undefined);
    const [addedAnnotation, setAddedAnnotation] = useState<Annotation | undefined>();


    useEffect(() => {
        fetchAnnotationsList();
    }, [program]);

    const fetchAnnotationsList = async () => {
        setLoading(true);
        console.log("Program: ", program);
        if (program && id) {
            // try {
            const annotations = await fetchAnnotations({
                program,
                filter: [
                    annotationAuthorFilter(id as string)
                ]
            });
            console.log("Annotations", annotations);
            setAnnotation(annotations);
            if (annotations.length != 0) {
                const topicPublicKeys = annotations.map((value, index) => value.parentTopic);
                const annotationTopics = await fetchMultipleTopics({
                    program,
                    listPubKeys: topicPublicKeys
                });

                console.log("annotationTopics", annotationTopics);
                setTopics(annotationTopics);

            }
            setLoading(false);
        }
    };

    const sortedAnnotations = orderBy(annotations, ["timestamp"], ["desc"]);

    console.log("SHOW DIALOG : ", showEditDialog);

    return (
        // <div className="w-11/12 mt-5">
        <div className='flex mt-5'>
            <div className='grow mr-10'>
                {
                        isLoading ?
                            (
                                <div className="flex justify-center items-center">
                                    <div className="spinner-grow inline-block w-8 h-8 bg-violet-500 rounded-full opacity-0" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <div className="sm:mt-10">
                                    {annotations && annotations.length == 0 ?
                                        (<div className="text-2xl font-extralight text-gray-600 grid justify-center mt-10">No Annotations</div>)
                                        : sortedAnnotations.map((t, i) => (
                                            <div className='' key={`annotationCards${t.publicKey}`}>
                                                <MyAnnotationCard content={t} topic={topics && t.parentTopic in topics ? topics[t.parentTopic] : null}
                                                    onEdit={(annotation) => { setAnnotationEdit(annotation); setshowEditDialog(true); }} />
                                            </div>))}
                                </div>)
                        
                }
            </div>
            <div className={`z-40 overflow-scroll fixed top-0 bottom-0 right-0 w-4/12 collapse collapse-horizontal ${showEditDialog ? "show" : ""}`} id="collapseWidthExample">
                {editAnnotation &&
                        <AddAnnotationForm onSubmit={() => { }}
                            onSuccess={(annotation) => {
                                const addedAnnotation = annotation;
                                console.log("Annotation Edited => ", addedAnnotation);
                                setAddedAnnotation(addedAnnotation);
                            }}
                            onError={(error) => {
                                console.log(error);
                                // snackbar().danger('Error!', error);
                            }}
                            onClose={() => {setshowEditDialog(false); }}
                            snippetType={editAnnotation.snippet_type}
                            parentAnnotation={editAnnotation.parentAnnotation}
                            parentTopic={editAnnotation.parentTopic.publicKey}
                            oldAnnotation={editAnnotation}
                            action={"edit"}
                            wallet={wallet}
                            program={program}
                        />}
                </div>
                {/* </div> */}
            </div>);
}

const AnnotationUser = ({ content }: any) => {
    return (<div className="text-base subpixel-antialiased text-right">
        {/* <div className='px-2 opacity-50'>added </div> */}

        {content.snippet_type == 0 ? (
            <span className=" font-semibold text-violet-500">Allegation</span>
        ) : content.snippet_type == 1 ? (
            <span className=" font-semibold text-teal-500">Support</span>
        ) : (
            <span className="font-semibold text-rose-500">Against</span>
        )}
        <div className="opacity-50 text-sm">{content.createdAgo} ago</div>

    </div>);
}



const MyAnnotationCard = ({ content, topic, onEdit }: any) => {
    console.log(content, topic);
    if (!content) return (<div></div>);
    return (

        <div className="group w-full" id={`my_annotation_${content.key}`}>
            {/* <div className={`w-full group`}> */}
            <div className="flex ml-5 sm:ml-0 ">
                <div className="max-w-2/12 pr-7 pb-10 mt-1 hidden sm:block">
                    <AnnotationUser content={content} />
                </div>
                {/* ${content.snippet_type == 0 ? "group-hover:bg-violet-50" : content.snippet_type == 1 ? "group-hover:bg-emerald-50" : "group-hover:bg-rose-50"}  */}
                <div className={`border-l-2 ${content.snippet_type == 0 ? "border-violet-300" : content.snippet_type == 1 ? "border-emerald-300" : "border-rose-300"} pb-10 pl-5`}>

                    <div className="flex">
                        <button type="button" className={`${content.snippet_type == 0 ? "bg-violet-400" : content.snippet_type == 1 ? "bg-emerald-400" : "bg-rose-400"} -ml-9 inline-block rounded-full text-white leading-normal uppercase shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-8 h-8`}>
                            {/* <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download"
                                className="w-3 mx-auto" role="img" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512">
                                <path fill="currentColor"
                                    d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z">
                                </path>
                            </svg> */}
                            <GetIcon forStat={content.snippet_type == 0 ? "allegation" : content.snippet_type == 1 ? "support" : "against"} showType="sm" />
                        </button>
                        {topic && (<div className="opacity-80 pl-2 mt-1"><span className="font-semibold text-cyan-700">TOPIC</span>

                            <Link href={`/topic/${topic.publicKey.toBase58()}`}>
                                <a className="underline underline-offset-8 px-2" >{topic.topic}</a>
                            </Link>

                        </div>)}
                    </div>

                    <div className={`border-4 border-transparent text-2xl rounded-lg shadow-md card p-4`}>
                    <div className='flex items-center border-b border-gray-300 pb-3 pt-3 dark:border-gray-700'>
                                <svg className='w-4 h-4 mr-2 dark:fill-gray-500' viewBox="72.249 94.929 326.585 308.221" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M 125.338 330.202 C 127.341 327.79 130.032 326.434 132.848 326.434 L 393.492 326.434 C 398.248 326.434 400.626 333.367 397.247 337.361 L 345.744 399.382 C 343.741 401.793 341.05 403.15 338.234 403.15 L 77.59 403.15 C 72.834 403.15 70.456 396.217 73.835 392.223 L 125.338 330.202 Z" />
                                    <path d="M 125.338 98.697 C 127.341 96.285 130.032 94.929 132.848 94.929 L 393.492 94.929 C 398.248 94.929 400.626 101.862 397.247 105.856 L 345.744 167.802 C 343.741 170.213 341.05 171.57 338.234 171.57 L 77.59 171.57 C 72.834 171.57 70.456 164.637 73.835 160.643 L 125.338 98.697 Z" />
                                    <path d="M 345.744 213.696 C 343.741 211.284 341.05 209.928 338.234 209.928 L 77.59 209.928 C 72.834 209.928 70.456 216.861 73.835 220.855 L 125.338 282.8 C 127.341 285.212 130.032 286.568 132.848 286.568 L 393.492 286.568 C 398.248 286.568 400.626 279.635 397.247 275.641 L 345.744 213.696 Z" />
                                </svg>
                                    <a href={`https://explorer.solana.com/address/${content.key}/instructions?cluster=devnet`} rel="noreferrer" target={"_blank"} className='hover:text-blue-700 text-blue-400 text-sm'>
                                    <span className="hidden sm:block">
                                    {content.key}
                                        </span>    
                                        <span className="sm:hidden flex">
                                    {content.key.slice(0, 7)} . <div className="pl-1 opacity-50 text-sm">{content.createdAgo} ago</div>
                                        </span>    
                                        
                                    </a>
                                
                                </div>
                    <div className="pb-2">
                        {content.uri && (
                                <a className="text-blue-400 text-base" rel="noreferrer" target={"_blank"} href={content.uri}>{getDomain(content.uri)}</a>
                            )}
                            </div>
                        {content.annotation}
                        <div className='flex justify-between items-center pt-2 pb-2'>

                            <DisplayStats allegations={content.allegations} support={content.support} against={content.against} showType={"sm"} />

                        </div>

                        {content.isEdited == 1 &&
                            (<div className="pt-2 border-t border-gray-300 dark:border-gray-700 ">
                            {content.isEdited == 1 ?
                            (<div className="text-sm">
                                New Edit : <a className="text-blue-400" href={`#my_annotation_${content.edited.toBase58()}`}>{content.edited.toBase58()}</a>
                                </div>)
                            : (<div></div>)}
                        </div>)
                        }
                        {content.edited.toBase58() != defaultKey.toBase58() && content.isEdited != 1 ?
                            (<div className="text-sm pt-2 border-t border-gray-300 dark:border-gray-700 mt-4">
                                Old Version : <a className="text-blue-400" href={`#my_annotation_${content.edited.toBase58()}`}>{content.edited.toBase58()}</a>
                                </div>)
                            : (<div></div>)}

                    </div>

                </div>

            </div>
        </div>
    );
};

function UserTopics() {

    const router = useRouter();
    const { id } = router.query;
    

    const wallet: any = useAnchorWallet();
    const [topics, setTopics] = useState<unknown[]>([]);
    const { program } = useProgram({ connection, wallet });
    const [isLoading, setLoading] = useState(false);
    const [isAddTopicLoading, setLoader] = useState<boolean>(false);
    const [addedTopic, setTopicSubmit] = useState<Topic>(undefined);

    useEffect(() => {
        fetchTopicsList();
    }, [program]);

    const fetchTopicsList = async () => {
        console.log("Program: ", program);
        if (program && id) {
            setLoading(true);
            // try {
            const topics = await fetchTopics({
                program,
                filter: [
                    topicAuthorFilter(id as string)
                ]
            });
            console.log("Topics", topics);
            setLoading(false);
            setTopics(topics);
        }
    };

    const sortedTopics = orderBy(topics, ["timestamp"], ["desc"]);

    return (
        <div className="w-8/12 mt-10">
            {
                
                    isLoading ?
                        (
                            <div className="flex justify-center items-center">
                                <div className="spinner-grow inline-block w-8 h-8 bg-violet-500 rounded-full opacity-0" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )
                        :
                        (
                            <>
                                {sortedTopics.length == 0 ?
                                    (<div className="text-2xl font-extralight text-gray-600 mt-20 grid justify-center">No Topics</div>)
                                    : sortedTopics.map((t: any) => (
                                        <div className='mt-10 sm:mt-0' key={`mytopic${t.publicKey}`}>
                                            <TopicCard content={t} />
                                        </div>))}
                            </>)
                    
            }

        </div>
    );
}


const TopicUser = ({ content }: any) => {
    return (<div className="text-base subpixel-antialiased text-right">

        <span className=" font-semibold text-blue-500"># {content.tag}</span>

        <div className="opacity-50 text-sm">{content.createdAgo} ago</div>

    </div>);
}


const TopicCard = ({ content, showStats = true, searchTerm = "" }: any) => {
    return (

        <div className="group w-full">
            {/* <div className={`w-full group`}> */}
            <div className="flex ml-3 sm:ml-0">
                <div className="w-2/12 pr-7 pb-10 mt-1 hidden sm:block">
                    <TopicUser content={content} />
                </div>
                {/* ${content.snippet_type == 0 ? "group-hover:bg-violet-50" : content.snippet_type == 1 ? "group-hover:bg-emerald-50" : "group-hover:bg-rose-50"}  */}
                <div className={`sm:border-l-2 sm:border-blue-300 pb-10 pl-5 `}>

                    <div className="flex">
                        <button type="button" className={`hidden sm:block bg-blue-400 -ml-9 inline-block rounded-full text-white leading-normal uppercase shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-8 h-8 `}>
                            <div>
                                <svg className="h-5 w-5 text-white mx-auto opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1">
                                    <g id="surface1">
                                        <path className="fill-white" d="M 22.515625 12.085938 C 22.480469 11.890625 22.363281 11.726562 22.191406 11.621094 C 18.292969 9.296875 16.003906 8.816406 14.328125 8.464844 C 14.113281 8.417969 13.902344 8.378906 13.703125 8.332031 L 12.976562 2.382812 C 12.953125 1.066406 11.875 0 10.554688 0 C 9.25 0 8.199219 1.007812 8.132812 2.300781 C 8.132812 2.324219 8.125 2.347656 8.125 2.371094 L 8.125 5.871094 L 8.070312 14.421875 L 7.144531 13.707031 C 6.964844 13.554688 5.714844 12.542969 4.164062 12.542969 C 3.117188 12.542969 2.1875 12.984375 1.402344 13.84375 C 1.179688 14.085938 1.160156 14.445312 1.351562 14.714844 C 1.417969 14.804688 3.007812 17.035156 5.503906 19.300781 C 6.980469 20.640625 8.472656 21.714844 9.929688 22.492188 C 11.789062 23.476562 13.605469 23.984375 15.335938 24 C 15.359375 24 15.390625 24 15.417969 24 C 17.777344 24 19.617188 23.21875 20.878906 21.683594 C 23.691406 18.265625 22.5625 12.335938 22.515625 12.085938 Z M 19.804688 20.8125 C 18.820312 22.011719 17.34375 22.617188 15.417969 22.617188 C 15.390625 22.617188 15.371094 22.617188 15.34375 22.617188 C 11.910156 22.59375 8.613281 20.257812 6.457031 18.300781 C 4.738281 16.742188 3.441406 15.171875 2.84375 14.398438 C 3.25 14.085938 3.6875 13.933594 4.167969 13.933594 C 5.28125 13.933594 6.246094 14.757812 6.253906 14.769531 C 6.261719 14.78125 6.277344 14.789062 6.289062 14.800781 L 8.335938 16.375 C 8.546875 16.535156 8.824219 16.566406 9.066406 16.449219 C 9.300781 16.335938 9.453125 16.09375 9.457031 15.832031 L 9.523438 5.882812 L 9.523438 2.417969 C 9.523438 2.414062 9.523438 2.402344 9.523438 2.398438 C 9.539062 1.832031 9.996094 1.390625 10.558594 1.390625 C 11.136719 1.390625 11.597656 1.859375 11.597656 2.429688 C 11.597656 2.453125 11.597656 2.484375 11.601562 2.511719 L 12.378906 8.972656 C 12.414062 9.257812 12.613281 9.488281 12.886719 9.558594 C 13.253906 9.65625 13.636719 9.738281 14.039062 9.820312 C 15.664062 10.160156 17.675781 10.585938 21.207031 12.648438 C 21.382812 13.839844 21.878906 18.292969 19.804688 20.8125 Z M 19.804688 20.8125 " />
                                    </g>
                                </svg></div>
                        </button>



                        <div className={`text-2xl pl-5`}>
                            <Link href={`/topic/${content.publicKey.toBase58()}`}>
                                <a className="" >{content.topic}</a>
                            </Link>
                            {/* {content.topic} */}
                            <div className='flex justify-between items-center pt-2 pb-2'>

                                <DisplayStats allegations={content.allegations} support={content.support} against={content.against} showType={"sm"} />

                                {content.uri && (
                                    <a className="text-blue-400 text-sm" rel="noreferrer" target={"_blank"} href={content.uri}>{getDomain(content.uri)}</a>
                                )}
                            </div>
                            {/* <button type="button"
                            onClick={(e) => onEdit(content)}
                            className="inline-block px-4 py-1 border-2 border-blue-400 text-blue-400 font-medium text-xs leading-tight uppercase rounded hover:bg-blue-400 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Edit</button> */}

                        </div>
                    </div>

                </div>

            </div>
        </div>
        // <div className='x-full group'>
        //     <div className="text-base subpixel-antialiased mb-2 flex justify-between">
        //         <div className="flex">
        //             <div className="font-bold opacity-40 hover:opacity-100">{content.authorDisplay}</div>
        //             <div className="text-grey-300 px-2">.</div>

        //             <div className="opacity-50">{content.createdAgo} ago</div></div>
        //         {content.tag ? (
        //             <div className="text-blue-400 text-base">#<span className="font-bold">{searchTerm}</span>
        //                 <span>{content.tag.replaceAll(searchTerm, "")}</span></div>
        //         ) : null}
        //     </div>
        //     <div className="y-3">
        //         <Link href={`/topic/${content.publicKey.toBase58()}`}>
        //             <a className="text-xl" >{content.topic}</a>
        //         </Link>
        //     </div>
        //     <div className='group-hover:flex hidden justify-between items-center'>
        //         {showStats &&
        //             (<div className=''>
        //                 <DisplayStats allegations={content.allegations} support={content.support} against={content.against} showType={"sm"} />
        //             </div>)
        //         }
        //     </div>
        // </div>
    );
};

const GetIcon = ({ forStat, showType }: any) => {
    switch (forStat) {
        case "allegation":
            return (
                <div>
                    <svg className="h-5 w-5 text-white mx-auto opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1">
                        <g id="surface1">
                            <path className="fill-white" d="M 22.515625 12.085938 C 22.480469 11.890625 22.363281 11.726562 22.191406 11.621094 C 18.292969 9.296875 16.003906 8.816406 14.328125 8.464844 C 14.113281 8.417969 13.902344 8.378906 13.703125 8.332031 L 12.976562 2.382812 C 12.953125 1.066406 11.875 0 10.554688 0 C 9.25 0 8.199219 1.007812 8.132812 2.300781 C 8.132812 2.324219 8.125 2.347656 8.125 2.371094 L 8.125 5.871094 L 8.070312 14.421875 L 7.144531 13.707031 C 6.964844 13.554688 5.714844 12.542969 4.164062 12.542969 C 3.117188 12.542969 2.1875 12.984375 1.402344 13.84375 C 1.179688 14.085938 1.160156 14.445312 1.351562 14.714844 C 1.417969 14.804688 3.007812 17.035156 5.503906 19.300781 C 6.980469 20.640625 8.472656 21.714844 9.929688 22.492188 C 11.789062 23.476562 13.605469 23.984375 15.335938 24 C 15.359375 24 15.390625 24 15.417969 24 C 17.777344 24 19.617188 23.21875 20.878906 21.683594 C 23.691406 18.265625 22.5625 12.335938 22.515625 12.085938 Z M 19.804688 20.8125 C 18.820312 22.011719 17.34375 22.617188 15.417969 22.617188 C 15.390625 22.617188 15.371094 22.617188 15.34375 22.617188 C 11.910156 22.59375 8.613281 20.257812 6.457031 18.300781 C 4.738281 16.742188 3.441406 15.171875 2.84375 14.398438 C 3.25 14.085938 3.6875 13.933594 4.167969 13.933594 C 5.28125 13.933594 6.246094 14.757812 6.253906 14.769531 C 6.261719 14.78125 6.277344 14.789062 6.289062 14.800781 L 8.335938 16.375 C 8.546875 16.535156 8.824219 16.566406 9.066406 16.449219 C 9.300781 16.335938 9.453125 16.09375 9.457031 15.832031 L 9.523438 5.882812 L 9.523438 2.417969 C 9.523438 2.414062 9.523438 2.402344 9.523438 2.398438 C 9.539062 1.832031 9.996094 1.390625 10.558594 1.390625 C 11.136719 1.390625 11.597656 1.859375 11.597656 2.429688 C 11.597656 2.453125 11.597656 2.484375 11.601562 2.511719 L 12.378906 8.972656 C 12.414062 9.257812 12.613281 9.488281 12.886719 9.558594 C 13.253906 9.65625 13.636719 9.738281 14.039062 9.820312 C 15.664062 10.160156 17.675781 10.585938 21.207031 12.648438 C 21.382812 13.839844 21.878906 18.292969 19.804688 20.8125 Z M 19.804688 20.8125 " />
                        </g>
                    </svg></div>);
        case "support":
            return (
                <div>
                    <svg className="h-5 w-5 text-white mx-auto opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg></div>
            );
        case "against":
            return (<div>
                <svg className="h-5 w-5 text-white mx-auto opacity-80 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg></div>);
    }
    return (<div></div>);
}