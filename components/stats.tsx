

interface  StatsProps{
    allegations:string,
    support:string,
    against: string,
    showType: string,
    onClickFunc?: Function,
    data?: any
}


export default function DisplayStats(Props: StatsProps) {
    const {
        allegations,
        support,
        against,
        showType,
        onClickFunc,
        data
    } = Props;
    console.log(showType);
    switch(showType) {
        case 'lg' : return (
                <div className='flex justify-between sm:justify-start'>
                    <div className="flex flex-col items-center">
                    <button className='flex' onClick={(e) => onClickFunc ? onClickFunc(data, 0) : null}>
                    <div className='border-indigo-400 text-indigo-500 rounded-l-lg border-2 p-1 pl-2 pr-2 sm:text-xl'>{allegations}</div>
                    <div className='flex bg-indigo-400 rounded-r-lg text-white p-1'>
                        <GetIcon forStat={"allegation"} />
                        <div className='pl-2 pr-2 leading-loose hidden sm:inline-block'>Allegations</div>
                    </div>
                    </button>
                    <div className='pl-2 pr-2 leading-loose sm:inline-block text-sm sm:hidden text-indigo-500'>Allegations</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                    <button className='flex px-4' onClick={(e) => onClickFunc ? onClickFunc(data, 1) : null}>
                        <div className='border-emerald-400 text-emerald-500 rounded-l-lg border-2 p-1 pl-2 pr-2 sm:text-xl'>{support}</div>
                        <div className='flex bg-emerald-400 rounded-r-lg text-white p-1'>
                        <GetIcon forStat={"support"} />
                            <div className='pl-2 pr-2 leading-loose hidden sm:inline-block'>Support</div>
                        </div>
                    </button>
                    <div className='pl-2 pr-2 leading-loose sm:inline-block text-sm sm:hidden text-emerald-500'>Support</div>
                    </div>
                    <div className="flex flex-col items-center">
                    <button className='flex' onClick={(e) => onClickFunc ? onClickFunc(data, 2) : null}>
                        <div className='border-rose-400 text-rose-500 rounded-l-lg border-2 p-1 pl-2 pr-2 sm:text-xl'>{against}</div>
                        <div className='flex bg-rose-400 rounded-r-lg text-white p-1'>
                        <GetIcon forStat={"against"} />
                            <div className='pl-2 pr-2 leading-loose hidden sm:inline-block'>Against</div>
                        </div>
                    </button>
                    <div className='pl-2 pr-2 leading-loose sm:inline-block text-sm sm:hidden text-rose-500'>Against</div>
                    </div>
                </div>
            );
            case 'sm' : return(
                <div className='flex'>
                    <button className='flex' data-bs-toggle="allegations" title="ALLEGATIONS" onClick={(e) => {e.stopPropagation(); onClickFunc ? onClickFunc(data, 0) : null;}}>
                    <div className='text-indigo-500 p-1 pl-2 pr-2 text-xl'>{allegations}</div>
                    <GetIcon forStat={"allegation"} showType={showType} />
                    </button>

                    <button className='flex px-4' data-bs-toggle="support" title="SUPPORT" onClick={(e) => {e.stopPropagation(); onClickFunc ? onClickFunc(data, 1) : null;}}>
                        <div className='text-emerald-500 p-1 pl-2 pr-2 text-xl'>{support}</div>
                        <GetIcon forStat={"support"} showType={showType} />
                        </button>
                    

                    <button className='flex' data-bs-toggle="against" title="AGAINST" onClick={(e) => {e.stopPropagation(); onClickFunc ? onClickFunc(data, 2) : null;}}>
                        <div className='text-rose-500 p-1 pl-2 pr-2 text-xl'>{against}</div>
                        <GetIcon forStat={"against"} showType={showType} />
                    </button>
                </div>
            )
        }
}

export const GetIcon = ({forStat, showType}: any) => {
    switch(forStat) { 
            case "allegation"  :
                        return (
                        <div>
                        <svg className={`${showType == 'sm' ? "mt-1 pt-1" : "mt-1"}`} xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                            <g id="surface1">
                                <path className={`${showType == 'sm' ? "fill-indigo-500" : "fill-white"} allegation_svg`}  d="M 22.515625 12.085938 C 22.480469 11.890625 22.363281 11.726562 22.191406 11.621094 C 18.292969 9.296875 16.003906 8.816406 14.328125 8.464844 C 14.113281 8.417969 13.902344 8.378906 13.703125 8.332031 L 12.976562 2.382812 C 12.953125 1.066406 11.875 0 10.554688 0 C 9.25 0 8.199219 1.007812 8.132812 2.300781 C 8.132812 2.324219 8.125 2.347656 8.125 2.371094 L 8.125 5.871094 L 8.070312 14.421875 L 7.144531 13.707031 C 6.964844 13.554688 5.714844 12.542969 4.164062 12.542969 C 3.117188 12.542969 2.1875 12.984375 1.402344 13.84375 C 1.179688 14.085938 1.160156 14.445312 1.351562 14.714844 C 1.417969 14.804688 3.007812 17.035156 5.503906 19.300781 C 6.980469 20.640625 8.472656 21.714844 9.929688 22.492188 C 11.789062 23.476562 13.605469 23.984375 15.335938 24 C 15.359375 24 15.390625 24 15.417969 24 C 17.777344 24 19.617188 23.21875 20.878906 21.683594 C 23.691406 18.265625 22.5625 12.335938 22.515625 12.085938 Z M 19.804688 20.8125 C 18.820312 22.011719 17.34375 22.617188 15.417969 22.617188 C 15.390625 22.617188 15.371094 22.617188 15.34375 22.617188 C 11.910156 22.59375 8.613281 20.257812 6.457031 18.300781 C 4.738281 16.742188 3.441406 15.171875 2.84375 14.398438 C 3.25 14.085938 3.6875 13.933594 4.167969 13.933594 C 5.28125 13.933594 6.246094 14.757812 6.253906 14.769531 C 6.261719 14.78125 6.277344 14.789062 6.289062 14.800781 L 8.335938 16.375 C 8.546875 16.535156 8.824219 16.566406 9.066406 16.449219 C 9.300781 16.335938 9.453125 16.09375 9.457031 15.832031 L 9.523438 5.882812 L 9.523438 2.417969 C 9.523438 2.414062 9.523438 2.402344 9.523438 2.398438 C 9.539062 1.832031 9.996094 1.390625 10.558594 1.390625 C 11.136719 1.390625 11.597656 1.859375 11.597656 2.429688 C 11.597656 2.453125 11.597656 2.484375 11.601562 2.511719 L 12.378906 8.972656 C 12.414062 9.257812 12.613281 9.488281 12.886719 9.558594 C 13.253906 9.65625 13.636719 9.738281 14.039062 9.820312 C 15.664062 10.160156 17.675781 10.585938 21.207031 12.648438 C 21.382812 13.839844 21.878906 18.292969 19.804688 20.8125 Z M 19.804688 20.8125 " />
                            </g>
                        </svg></div>);
                        case "support"  :
                            return (
                                <div>
                            <svg className={`${showType == 'sm' ? "text-emerald-500 mt-1 h-6 w-6" : "h-7 w-7 text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg></div>
);
                            case "against"  :
                                return (<div>
                                    <svg className={`${showType == 'sm' ? "text-rose-500 mt-2 h-6 w-6" : "h-7 w-7 text-white sm:mt-1 "}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg></div>);
        }
        return (<div></div>);
}