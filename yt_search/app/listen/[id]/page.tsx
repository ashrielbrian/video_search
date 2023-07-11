"use client";
import supabase from "@/utils/supabase";
import YouTubePlayer from "@/components/Youtube";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Text } from "@chakra-ui/react";
import { formatTime } from "@/utils/util";
import convertNewlinesToParagraphs from "@/components/NewlineText";

interface VideoListenPageProps {
    id: string;
}

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

    return (
        <div className="text-center max-w-6xl mx-auto p-4 bg-white">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-red-400 text-transparent bg-clip-text mb-4">
                {video?.title}
            </h2>
            {res ? (
                <div className="flex flex-col p-2">
                    <div className="border rounded-md border-indigo-600 p-4 mb-8 bg-white text-indigo-700 font-bold text-sm md:text-md lg:text-lg">
                        <span className="font-bold underline">{formatTime(parseInt(ts))}</span> {" "}
                        <span className="font-semibold">{content}{" "}
                            {content.endsWith(".") ||
                                content.endsWith("!") ||
                                content.endsWith("?")
                                ? ""
                                : "..."}
                        </span>

                    </div>
                    <YouTubePlayer videoId={id} timestamp={parseInt(ts)} />

                    <Accordion defaultIndex={[0]} allowToggle className="mt-4 lg:mt-8">
                        <AccordionItem m={4} className="border border-black">
                            <h2>
                                <AccordionButton>
                                    <Box as="span" flex="1" textAlign="center">
                                        <span className="font-bold text-md lg:text-lg">{res.overallSummary?.title}</span>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>

                            <AccordionPanel pb={4}>
                                <div className="text-left text-md px-1 lg:px-8 lg:text-lg">
                                    {convertNewlinesToParagraphs(res.overallSummary?.summary)}
                                </div>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
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
