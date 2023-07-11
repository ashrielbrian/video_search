import React from "react";

const convertNewlinesToParagraphs = (text?: string) => {
    if (!text) {
        return <React.Fragment />;
    }
    const paragraphs = text.split("\n").map((paragraph, index) => {
        if (paragraph.length > 0) {
            return (
                <React.Fragment key={index}>
                    <p>{paragraph} </p>
                    < br />
                </React.Fragment>
            );
        }
    });
    return paragraphs;
}

export default convertNewlinesToParagraphs;