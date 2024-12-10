"use client";

import { VideoSearch } from "@/lib/types";
import { useState, ChangeEvent, FormEvent } from "react";

interface SearchBoxProps {
    getSearchResults: (videos: VideoSearch[]) => void; // replace `void` with the return type of `getSearchResults`
    setGridLoadingStatus: (status: boolean) => void;
}

export const SearchBox = ({
    getSearchResults,
    setGridLoadingStatus,
}: SearchBoxProps) => {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSearching(true);
        setGridLoadingStatus(true);

        const data = {
            query,
        };

        const response = await fetch("/api/embedding", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const { results } = await response.json();
        getSearchResults(results);
        setIsSearching(false);
        setGridLoadingStatus(false);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    return (
        <div className="flex flex-col mt-6 max-w-xl mx-auto p-2">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    id="text-input"
                    className="w-full border border-indigo-300 py-2 px-4  text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Search across MLJ sermons here.."
                    onChange={handleInputChange}
                    disabled={isSearching}
                />
                {/* <button type="submit" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Submit</button> */}
            </form>
        </div>
    );
};
