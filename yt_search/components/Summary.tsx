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
    overallSummary: OverallSummary;
    summaries: TopicSummary[];
}

const TopicItem = ({ title, summary }: { title: string; summary: string }) => {
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
                {summary}
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
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <Text
            // isTruncated={!expanded}
            noOfLines={!expanded ? maxLines : undefined}
            onClick={toggleExpanded}
            cursor={!expanded ? "pointer" : "initial"}
            className="text-left"
        >
            {text}
        </Text>
    );
};

const SummaryComponent = ({ overallSummary, summaries }: Summary) => {
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
                        title={summary.title}
                        summary={summary.summary}
                    />
                ))}
            </Accordion>
        </div>
    );
};

export default SummaryComponent;
