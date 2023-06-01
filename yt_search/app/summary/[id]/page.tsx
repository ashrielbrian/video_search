import { NextPage } from "next"
import supabase from "@/utils/supabase"
interface VideoSummaryPageProps {
    params: {
        id: string
    }
}

type Topic = {
    title: string,
    summary: string,
    segment_ids: number[],
    start_times: number[],
    segment_texts: string[]
}

const getSummary = async (videoId: string) => {
    const results = await supabase.rpc("get_summary_segments", {
        p_video_id: videoId
    }).order("order");

    let overallSummaryRes = await supabase.from("summary")
        .select("order,title,summary")
        .eq("video_id", videoId)
        .eq("order", 0)
        .single();
        let overallSummary = overallSummaryRes.data;
    console.log(results.data, overallSummary)

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
                segment_texts: []
            }
        });

        for (let d of results.data) {
            let idx = d.order - 1;
            summaries[idx].title = d.title;
            summaries[idx].summary = d.summary;
            summaries[idx].start_times.push(d.start_time);
            summaries[idx].segment_ids.push(d.start_segment_id);
            summaries[idx].segment_texts.push(d.text);
        }
        return {summaries, overallSummary}
    }


    return null;
}

const VideoSummaryPage = async ({ params: { id } }: VideoSummaryPageProps) => {
    const res = await getSummary(id);

    return (
        <div className="flex justify-center text-center mx-auto p-4">
            <h2 className="text-xl font-extrabold">Video summary coming soon... {id}</h2>


            <div className="flex flex-col">

            {res ? res.summaries.map((topic, idx) => (
                <p key={idx}>{topic.title}</p>
                )): <></>}
            </div>

        </div>
    )
}

export default VideoSummaryPage;