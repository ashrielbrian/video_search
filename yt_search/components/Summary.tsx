"use client";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Text,
} from "@chakra-ui/react";
import SummarySegment from "./SummarySegment";
import React, { useState } from "react";
import YouTubePlayer from "./Youtube";

interface OverallSummary {
    order: number;
    title: string | null;
    summary: string;
}

interface TopicSummary {
    title: string;
    summary: string;
    segment_ids: number[];
    segment_texts: string[];
    start_times: number[];
}

interface Summary {
    videoId: string;
    overallSummary: OverallSummary | null;
    summaries: TopicSummary[];
    timestamp?: number;
}

const TopicItem = ({
    videoId,
    title,
    summary,
    segmentStartTimes,
    segmentTexts,
    changeVideoTimestamp,
}: {
    videoId: string;
    title: string;
    summary: string;
    segmentStartTimes: number[];
    segmentTexts: string[];
    changeVideoTimestamp: (s: number) => void;
}) => {
    let url = `https://youtube.com/watch?v=${videoId}`;

    return (
        <AccordionItem>
            <h2>
                <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                        <span className="font-semibold">{title}</span>
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="text-left">
                <div className="p-2">{summary}</div>
                <SummarySegment
                    segmentStartTimes={segmentStartTimes}
                    segmentTexts={segmentTexts}
                    changeVideoTimestamp={changeVideoTimestamp}
                />
                {/* <div className="p-4">
                    {segmentStartTimes.map((segment, idx) => (
                        <div
                            key={idx}
                            className="border border-indigo-600 rounded-md text-gray-700 p-1 mb-2 hover:underline transition-colors mr-2"
                        >
                            <Link
                                href={url + `&t=${Math.floor(segment)}`}
                                target="_blank"
                            >
                                <span className="font-bold">
                                    {formatTime(segment)}
                                </span>{" "}
                                -{" "}
                                <span className="font-semibold">
                                    {segmentTexts[idx]}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div> */}
            </AccordionPanel>
        </AccordionItem>
    );
};

const ExpandableText = ({
    text,
    maxLines,
}: {
    text?: string;
    maxLines: number[];
}) => {
    function convertNewlinesToParagraphs(text?: string) {
        if (!text) {
            return <React.Fragment />;
        }
        const paragraphs = text.split("\n").map((paragraph, index) => {
            if (paragraph.length > 0) {
                return (
                    <React.Fragment key={index}>
                        <p>{paragraph}</p>
                        <br />
                    </React.Fragment>
                );
            }
        });
        return paragraphs;
    }

    return (
        <div className="text-left pr-8 pl-8">
            {convertNewlinesToParagraphs(text)}
        </div>
    );
};

const SummaryComponent = ({
    videoId,
    overallSummary,
    summaries,
    timestamp,
}: Summary) => {
    const [startTime, setStartTime] = useState(timestamp ? timestamp : 0);
    const changeVideoTimestamp = (s: number) => {
        setStartTime(s);
    };

    return (
        <>
            <YouTubePlayer videoId={videoId} timestamp={startTime} />
            <div className="flex flex-col justify-center text-center mx-auto mt-8">
                <h2 className="font-bold text-lg">{overallSummary?.title}</h2>

                {/* <Text noOfLines={[1, 2, 3]}>{overallSummary.summary}</Text> */}
                <ExpandableText
                    text={overallSummary?.summary}
                    maxLines={[3, 3, 3]}
                />
                <Accordion>
                    {summaries.map((summary, idx) => (
                        <TopicItem
                            videoId={videoId}
                            key={idx}
                            title={summary.title}
                            summary={summary.summary}
                            segmentStartTimes={summary.start_times}
                            segmentTexts={summary.segment_texts}
                            changeVideoTimestamp={changeVideoTimestamp}
                        />
                    ))}
                </Accordion>
            </div>
        </>
    );
};

export default SummaryComponent;
