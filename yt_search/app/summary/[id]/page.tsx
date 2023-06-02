import { NextPage } from "next";
import supabase from "@/utils/supabase";
import Summary from "@/components/Summary";
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
        console.log(overallSummary, summaries);
        return { summaries, overallSummary };
    }

    return null;
};

const VideoSummaryPage = async ({ params: { id } }: VideoSummaryPageProps) => {
    const res = await getSummary(id);
    console.log(res);
    return (
        <div className="mx-auto p-4">
            {res && res.overallSummary && res.summaries ? (
                <div className="flex flex-col">
                    <Summary
                        overallSummary={res.overallSummary}
                        summaries={res.summaries}
                    />
                </div>
            ) : (
                <h2 className="text-xl font-extrabold">
                    No summary for this video just yet...
                </h2>
            )}
        </div>
    );
};

export default VideoSummaryPage;
