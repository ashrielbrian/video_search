"use client";
import supabase from "@/utils/supabase";
import Summary from "@/components/Summary";
import YouTubePlayer from "@/components/Youtube";
import { Text } from "@chakra-ui/react";

interface VideoListenPageProps {
    id: string;
}

type Topic = {
    title: string;
    summary: string;
    segment_ids: number[];
    start_times: number[];
    segment_texts: string[];
};

export async function generateStaticParams() {
    const { data: video } = await supabase.from("video").select("id");

    if (video) {
        return video.map(({ id }) => ({
            id,
        }));
    } else {
        return [];
    }
}

const getSummary = async (videoId: string) => {
    let overallSummaryRes = await supabase
        .from("summary")
        .select('"order",title,summary')
        .eq("video_id", videoId)
        .eq('"order"', 0)
        .single();
    let overallSummary = overallSummaryRes.data;

    return { summaries: [], overallSummary };
};

const getVideoDetails = async (videoId: string) => {
    const results = await supabase
        .from("video")
        .select("title")
        .eq("id", videoId)
        .single();

    return results.data;
};

const VideoListenPage = async ({
    params: { id },
    searchParams: { ts, content },
}: {
    params: VideoListenPageProps;
    searchParams: { ts: string; content: string };
}) => {
    const res = await getSummary(id);
    const video = await getVideoDetails(id);

    console.log(ts, content);

    return (
        <div className="text-center max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-red-400 text-transparent bg-clip-text mb-4">
                {video?.title}
            </h2>
            {res ? (
                <div className="flex flex-col p-2">
                    <Text className="font-bold text-lg text-slate-700 mb-4">
                        {content}
                    </Text>
                    <Summary
                        videoId={id}
                        overallSummary={res.overallSummary}
                        summaries={[]}
                        timestamp={parseInt(ts)}
                    />
                </div>
            ) : (
                <>
                    <YouTubePlayer videoId={id} timestamp={parseInt(ts)} />
                    <h2 className="text-xl font-extrabold p-2">
                        No summary for this video just yet...
                    </h2>
                </>
            )}
        </div>
    );
};

export default VideoListenPage;
