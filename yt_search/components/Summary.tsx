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
import Link from "next/link";
import React from "react";
import { useState } from "react";

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
    overallSummary: OverallSummary;
    summaries: TopicSummary[];
}

const TopicItem = ({
    videoId,
    title,
    summary,
    segmentStartTimes,
    segmentTexts,
    keyIdx,
}: {
    videoId: string;
    title: string;
    summary: string;
    segmentStartTimes: number[];
    segmentTexts: string[];
    keyIdx: number;
}) => {
    function formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = (seconds % 60).toFixed(0);

        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(remainingSeconds).padStart(2, "0");

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    let url = `https://youtube.com/watch?v=${videoId}`;

    return (
        <AccordionItem key={keyIdx}>
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
                <div className="p-4">
                    {segmentStartTimes.map((segment, idx) => (
                        <div className="border border-indigo-600 rounded-md text-gray-700 p-1 mb-2 hover:underline transition-colors mr-2">
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
                </div>
            </AccordionPanel>
        </AccordionItem>
    );
};

const ExpandableText = ({
    text,
    maxLines,
}: {
    text: string;
    maxLines: number[];
}) => {
    // const [expanded, setExpanded] = useState(false);
    // const toggleExpanded = () => {
    //     setExpanded(!expanded);
    // };

    function convertNewlinesToParagraphs(text: string) {
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
        // <Text
        //     // isTruncated={!expanded}
        //     noOfLines={!expanded ? maxLines : undefined}
        //     onClick={toggleExpanded}
        //     cursor={!expanded ? "pointer" : "initial"}
        //     className="text-left pr-4 pl-4"
        // >
        //     {convertNewlinesToParagraphs(text)}
        // </Text>
        <div className="text-left pr-8 pl-8">
            {convertNewlinesToParagraphs(text)}
        </div>
    );
};

const SummaryComponent = ({ videoId, overallSummary, summaries }: Summary) => {
    return (
        <div className="flex flex-col justify-center text-center mx-auto">
            <h2 className="font-semibold text-lg">{overallSummary.title}</h2>

            {/* <Text noOfLines={[1, 2, 3]}>{overallSummary.summary}</Text> */}
            <ExpandableText
                text={overallSummary.summary}
                maxLines={[3, 3, 3]}
            />
            <Accordion>
                {summaries.map((summary, idx) => (
                    <TopicItem
                        videoId={videoId}
                        keyIdx={idx}
                        title={summary.title}
                        summary={summary.summary}
                        segmentStartTimes={summary.start_times}
                        segmentTexts={summary.segment_texts}
                    />
                ))}
            </Accordion>
        </div>
    );
};

export default SummaryComponent;
