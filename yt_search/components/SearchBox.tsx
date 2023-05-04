"use client"

import { useState } from "react"

export const SearchBox = ({ getSearchResults, setGridLoadingStatus }) => {

    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (event) => {
        event.preventDefault();
        setIsSearching(true);
        setGridLoadingStatus(true);

        const data = {
            query
        }

        const response = await fetch("/api/embedding", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { results } = await response.json();
        getSearchResults(results.data);
        setIsSearching(false);
        setGridLoadingStatus(false);
    }

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };


    return (
        <div className="flex flex-col mt-6 max-w-xl mx-auto p-2">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    id="text-input"
                    className="w-full border border-gray-300 py-2 px-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search across MLJ sermons here.."
                    onChange={handleInputChange}
                    disabled={isSearching}
                />
                {/* <button type="submit" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Submit</button> */}
            </form>
        </div>
    )
}