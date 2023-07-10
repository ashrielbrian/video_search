"use client";

import React from "react";
import YouTube from "react-youtube";

interface YouTubePlayerProps {
    videoId: string;
    timestamp?: number;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
    videoId,
    timestamp,
}) => {
    const opts = {
        // height: "390",
        // width: "640",
        playerVars: {
            autoplay: 1,
            start: timestamp?.toString(), // Specify the timestamp in seconds
            // You can customize the player by passing additional parameters here
        },
    };

    return (
        <YouTube videoId={videoId} opts={opts} className="relative overflow:hidden pt-[56.25%]" iframeClassName="absolute top-0 left-0 w-full h-full" />
    );
};

export default YouTubePlayer;
