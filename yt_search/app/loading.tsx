"use client";

import { CircularProgress } from "@chakra-ui/react";

const Loading = () => {
    return (
        // Change the size to 120px
        <CircularProgress value={30} size="120px" />
    );
};
export default Loading;
