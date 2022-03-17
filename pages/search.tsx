import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { orderBy } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Annotations from "../components/Annotations";
import DisplayStats from "../components/stats";
import { useProgram } from "../composables/useWorkspace";
import { annotationTopicFilter } from "../lib/annotations";
import fetchTopics, { topicFilter } from "../lib/fetch-topics";
import { connection } from "./_app";


const preventDefault = f => e => {
    e.preventDefault()
    f(e)
}

export const SearchForm = () => {
    const router = useRouter()
    const [query, setQuery] = useState(router && router.query ? router.query.q : '')
    const handleParam = setValue => e => setValue(e.target.value)

    const handleSubmit = preventDefault(() => {
        router.push({
            pathname: "/search",
            query: { q: query },
        })
    });

    return (<form onSubmit={handleSubmit}>
        <div className="flex justify-center w-full md:w-8/12 items-center p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mr-3 text-grey" fill="none" viewBox="0 0 24 24" stroke="lightgrey">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            {/* <div className="flex justify-center"> */}
            <div className="w-full">
                <input
                    value={query}
                    onChange={handleParam(setQuery)}
                    type="search"
                    className="
            form-control
            block
            w-full
            px-7
            py-2
            text-xl
            font-normal
            text-gray-700
            bg-slate-100 bg-clip-padding
            border border-solid border-gray-100
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
          "
                    id="exampleSearch"
                    placeholder="Search Topic Tag"
                />
                {/* </div> */}
            </div>
        </div>
    </form>);
}


export default function SearchPage() {
    const router = useRouter()
    const wallet: any = useAnchorWallet();
    const [topics, setTopics] = useState<unknown[]>([]);
    const { program } = useProgram({ connection, wallet });

    useEffect(() => {
        if (router && router.query) {
            console.log("SEARCH TAG ::: ", router.query.q)
            fetchTopicsList(router.query.q);
        }

    }, [program, router]);

    const fetchTopicsList = async (tag) => {
        console.log("WALLET: ", wallet);
        console.log("Program: ", program);
        if (program) {
            // try {
            const topics = await fetchTopics({
                program,
                filter: [
                    topicFilter(tag)
                ]
            });
            console.log("Topics", topics);
            setTopics(topics);
        }
    };

    const sortedTopics = orderBy(topics, ["timestamp"], ["desc"]);

    return (
        <>
            <SearchForm />
            <div className="p-2 sm:mt-10 w-full sm:w-8/12 pt-3">
            <h1 className="text-2xl font-extralight text-gray-600 mb-10">Topics</h1>
                {sortedTopics.map((t: any) => (
                    <div className='mb-5 pb-5 border-b border-gray-200' key={`topic${t.publicKey}`}>
                        <TopicCard content={t} searchTerm={router && router.query ? router.query.q : ""} />
                    </div>
                ))}
            
            {
                Object.keys(sortedTopics).length != 0 &&
                (<>
                <h1 className="text-2xl font-extralight text-gray-600 mb-10 mt-10 sm:mt-20">Annotations</h1>
                {sortedTopics.map((t: any) => (
                <Annotations key={`annotation${t.publicKey}`} filter_annotation={annotationTopicFilter(t.publicKey)} />
                ))}
                </>)
            }
</div>
        </>);
}

const TopicCard = ({ content, showStats = true, searchTerm="" }: any) => {
    return (
        <div className='x-full group'>
            <div className="text-sm sm:text-base subpixel-antialiased mb-2 flex justify-between">
                <div className="flex">
                <div className="font-bold opacity-40 hover:opacity-100">{content.authorDisplay}</div>
                <div className="text-grey-300 px-2">.</div>
                
                <div className="opacity-50">{content.createdAgo} ago</div></div>
                {content.tag ? (
                    <div className="text-blue-400 text-base">#<span className="font-bold">{searchTerm}</span>
                    <span>{content.tag.replaceAll(searchTerm, "")}</span></div>
                ) : null}
            </div>
            <div className="y-3">
                <Link href={`/topic/${content.publicKey.toBase58()}`}>
                    <a className="text-xl" >{content.topic}</a>
                </Link>
            </div>
            <div className='group-hover:flex hidden justify-between items-center'>
                {showStats &&
                    (<div className=''>
                        <DisplayStats allegations={content.allegations} support={content.support} against={content.against} showType={"sm"} />
                    </div>)
                }
            </div>
        </div>
    );
};