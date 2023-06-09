import supabase from "@/utils/supabase";
import Summary from "@/components/Summary";
import YouTubePlayer from "@/components/Youtube";

interface VideoSummaryPageProps {
    params: {
        id: string;
    };
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
    const results = await supabase
        .rpc("get_summary_segments", {
            p_video_id: videoId,
        })
        .order("order");

    let overallSummaryRes = await supabase
        .from("summary")
        .select('"order",title,summary')
        .eq("video_id", videoId)
        .eq('"order"', 0)
        .single();
    let overallSummary = overallSummaryRes.data;

    if (results.data && results.data.length > 0) {
        // get the total number of topics for this video summary
        const numTopics = results.data.reduce((maxValue, obj) => {
            const value = obj.order;
            return value > maxValue ? value : maxValue;
        }, 0);

        // create an empty list of topics to be populated
        const summaries: Topic[] = Array.from({ length: numTopics }, () => {
            return {
                title: "",
                summary: "",
                segment_ids: [],
                start_times: [],
                segment_texts: [],
            };
        });

        for (let d of results.data) {
            let idx = d.order - 1;
            summaries[idx].title = d.title;
            summaries[idx].summary = d.summary;
            summaries[idx].start_times.push(d.start_time);
            summaries[idx].segment_ids.push(d.start_segment_id);
            summaries[idx].segment_texts.push(d.text);
        }
        return { summaries, overallSummary };
    }

    return { summaries: [], overallSummary: null };
};

const getVideoDetails = async (videoId: string) => {
    const results = await supabase
        .from("video")
        .select("title")
        .eq("id", videoId)
        .single();

    return results.data;
};

const VideoSummaryPage = async ({ params: { id } }: VideoSummaryPageProps) => {
    const res = await getSummary(id);
    const video = await getVideoDetails(id);

    return (
        <div className="text-center max-w-6xl mx-auto p-4 bg-white">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-red-500 text-transparent bg-clip-text mb-4">
                {video?.title}
            </h2>
            {res ? (
                <div className="flex flex-col p-2">
                    <Summary
                        videoId={id}
                        overallSummary={res.overallSummary}
                        summaries={res.summaries}
                    />
                </div>
            ) : (
                <>
                    <YouTubePlayer videoId={id} />
                    <h2 className="text-xl font-extrabold p-2">
                        No summary for this video just yet...
                    </h2>
                </>
            )}
        </div>
    );
};

export default VideoSummaryPage;
