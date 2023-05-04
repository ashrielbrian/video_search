import Image from "next/image"
import Link from "next/link"
import { Video, VideoSearch } from "@/lib/types"

export const Cell = ({ video }: { video: Video | VideoSearch }) => {


    let url = `https://youtube.com/watch?v=${video.id}`;
    let desc = video.description?.substring(0, 250) + "...";

    if (video.start_time) {
        url = url + `&t=${Math.floor(video.start_time)}`
    }

    if (video.content) {
        desc = `...${video.content}`;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mt-2 transition-transform duration-500 transform hover:-translate-y-1 hover:scale-105">
            <div className="flex flex-row">

                {video.thumbnail && <Image src={video.thumbnail} alt="Placeholder image" className="w-full h-48 object-cover rounded-t-lg" height={150} width={150} />}

                <div className="p-4">
                    <Link href={url} target="_blank">
                        <h2 className="text-lg font-bold mb-2">{video.title}</h2>
                    </Link>
                    <p className="text-gray-700">{desc}</p>
                    <Link href={`/summary/${video.id}`}>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600 ransition-colors duration-300 ease-in-out">View Summary</button>
                    </Link>
                </div>
            </div>
        </div >
    )
}