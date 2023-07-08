"use client";

import { CircularProgress } from "@chakra-ui/react";

const Loading = () => {
    return (
        // Change the size to 120px
        <div className="max-w-7xl mx-auto pt-4 text-center">
            <CircularProgress isIndeterminate={true} color="indigo.500" />
        </div>
    );
};
export default Loading;
