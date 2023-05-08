import Image from "next/image"
import Link from "next/link"
import { Video, VideoSearch } from "@/lib/types"

export const Cell = ({ video }: { video: Video | VideoSearch }) => {


    let url = `https://youtube.com/watch?v=${video.id}`;
    let desc = video.description?.substring(0, 500) + "...";

    if ("start_time" in video) {
        url = url + `&t=${Math.floor(video.start_time)}`
    }

    if ("content" in video) {
        desc = `...${video.content}`;
    }

    return (


        <div className="bg-white rounded-lg shadow-lg p-4 mt-2 transition-transform duration-500 transform hover:-translate-y-1 hover:scale-102 flex flex-col min-h-250">
            <div className="flex flex-row flex-grow">

                {video.thumbnail && <Image src={video.thumbnail} alt="Placeholder image" className="w-full h-48 object-cover rounded-t-lg" height={100} width={100} />}

                <div className="flex flex-col p-4">
                    <Link href={url} target="_blank">
                        <h2 className="text-lg font-bold mb-2 text-grey-500 hover:text-indigo-700 hover:underline transition-colors">{video.title}</h2>
                    </Link>

                    <p className="text-gray-700 flex-grow">{desc}</p>

                    <div className="flex flex-row justify-center">
                        {"start_time" in video ? (
                            <Link href={url} target="_blank">
                                <button className="bg-transparent text-indigo-500 font-semibold border border-indigo-500 py-2 px-4 mt-4 mr-2 hover:bg-indigo-600  hover:text-white transition-colors duration-300 ease-in-out">Listen to Snippet</button>
                            </Link>
                        ) : (
                            <Link href={url} target="_blank">
                                <button className="bg-indigo-500 text-white py-2 px-4 mt-4 hover:bg-indigo-600 transition-colors duration-300 ease-in-out">Watch Sermon</button>
                            </Link>
                        )}
                    </div>

                </div>
            </div>

        </div>

    )
}