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
            <Image src="https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQkrjYxSfSHeCEA7hkPy8e2JphDsfFHZVKqx-3t37E4XKr-AT7DML8IwtwY0TnZsUcQ" alt="Placeholder image" className="w-full h-48 object-cover rounded-t-lg" height={150} width={150} />
            <div className="p-4">
                <Link href={url} target="_blank">
                    <h2 className="text-lg font-bold mb-2">{video.title}</h2>
                </Link>
                <p className="text-gray-700">{desc}</p>
                <Link href={`/summary/${video.id}`}>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600 ransition-colors duration-300 ease-in-out">View Summary</button>
                </Link>
            </div>
        </div >
    )
}