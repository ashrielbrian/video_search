import { Button } from "@chakra-ui/react";

const SummarySegmentComponent = ({
    segmentTexts,
    segmentStartTimes,
    changeVideoTimestamp,
}: {
    segmentTexts: string[];
    segmentStartTimes: number[];
    changeVideoTimestamp: (s: number) => void;
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

    return (
        <div className="p-4">
            {segmentStartTimes.map((segment, idx) => (
                <div
                    key={idx}
                    className="border border-indigo-600 rounded-md text-gray-700 p-1 mb-2 hover:cursor-pointer hover:underline transition-colors mr-2"
                    onClick={() => changeVideoTimestamp(Math.floor(segment))}
                >
                    <span className="font-bold">{formatTime(segment)}</span>
                    {" - "}
                    <span className="font-semibold">{segmentTexts[idx]}</span>
                </div>
            ))}
        </div>
    );
};

export default SummarySegmentComponent;
