"use client";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
} from "@chakra-ui/react";
import SummarySegment from "./SummarySegment";
import React, { useState } from "react";
import YouTubePlayer from "./Youtube";
import convertNewlinesToParagraphs from "./NewlineText";

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
        <AccordionItem my={4} className="border border-black">
            <h2>
                <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                        <span className="font-semibold">{title}</span>
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="text-left w-full">
                <div className="text-left text-md px-1 lg:px-8 lg:text-lg">{summary}</div>
                <SummarySegment
                    segmentStartTimes={segmentStartTimes}
                    segmentTexts={segmentTexts}
                    changeVideoTimestamp={changeVideoTimestamp}
                />
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

    return (
        <div className="text-left text-md px-1 lg:px-8 lg:text-lg">
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
            <div className="flex flex-col justify-center text-center mx-auto lg:mx-16 xl:mx-24 mt-8">

                <Accordion allowToggle>
                    <AccordionItem className="border border-black">
                        <h2>
                            <AccordionButton>
                                <Box as="span" flex="1" textAlign="center">
                                    <span className="font-bold text-md lg:text-lg">{overallSummary?.title}</span>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>

                        <AccordionPanel pb={2}>
                            <ExpandableText
                                text={overallSummary?.summary}
                                maxLines={[3, 3, 3]}
                            />
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

                <Accordion allowToggle>
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
