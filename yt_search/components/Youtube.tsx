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
        height: "390",
        width: "640",
        playerVars: {
            autoplay: 1,
            start: timestamp?.toString(), // Specify the timestamp in seconds
            // You can customize the player by passing additional parameters here
        },
    };

    return (
        <div className="flex justify-center items-center">
            <YouTube videoId={videoId} opts={opts} />
        </div>
    );
};

export default YouTubePlayer;
