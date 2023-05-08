import { NextPage } from "next"
interface VideoSummaryPageProps {
    params: {
        id: string
    }
}

const VideoSummaryPage: NextPage<VideoSummaryPageProps> = ({ params: { id } }) => {
    return (
        <div className="flex justify-center text-center mx-auto p-4">
            <h2 className="text-xl font-extrabold">Video summary coming soon... {id}</h2>
        </div>
    )
}

export default VideoSummaryPage;