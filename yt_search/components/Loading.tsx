import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full mt-10">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Give us 10 secs while we search across his sermons 😇</h2>
        </div>
    );
};

export default LoadingSpinner;