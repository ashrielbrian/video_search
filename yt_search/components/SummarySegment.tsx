import { formatTime } from "@/utils/util";

const SummarySegmentComponent = ({
    segmentTexts,
    segmentStartTimes,
    changeVideoTimestamp,
}: {
    segmentTexts: string[];
    segmentStartTimes: number[];
    changeVideoTimestamp: (s: number) => void;
}) => {


    return (
        <div className="p-4">
            {segmentStartTimes.map((segment, idx) => (
                <div
                    key={idx}
                    className="border border-indigo-600 rounded-md text-gray-700 p-1 mb-2 hover:cursor-pointer hover:underline transition-colors mr-2 text-sm lg:text-base"
                    onClick={() => changeVideoTimestamp(Math.floor(segment))}
                >
                    <span className="font-bold text-indigo-700">{formatTime(segment)}</span>
                    {" - "}
                    <span className="font-semibold text-indigo-700">{segmentTexts[idx]}</span>

                </div>
            ))}
        </div>
    );
};

export default SummarySegmentComponent;
