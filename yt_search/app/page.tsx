'use client'

import supabase from "@/utils/supabase";
import { useState, useEffect } from 'react';
import { SearchBox } from '@/components/SearchBox';

import { Grid } from '@/components/Grid';
import { Video, VideoSearch } from '@/lib/types';
import LoadingSpinner from "@/components/Loading";

const fetchVideos = async (offset: number, limit: number = 10): Promise<Video[]> => {
    const { data, error } = await supabase.from('video').select().range(offset, offset + limit - 1);
    if (error) {
        console.error(error);
        return [];
    }
    return data ?? [];
};


export default function Home() {

    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [offset, setOffset] = useState(0);

    const fetchMoreVideos = async () => {
        setIsMoreLoading(true);
        const newVideos = await fetchVideos(offset, 10);
        setVideos(prevVideos => [...prevVideos, ...newVideos]);
        setOffset(prevOffset => prevOffset + 10);
        setIsMoreLoading(false);
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
        ) {
            fetchMoreVideos();
        }
    };

    useEffect(() => {
        // Fetch initial videos
        const fetchInitialVideos = async () => {
            setIsLoading(true);
            const initialVideos = await fetchVideos(offset, 10);
            setVideos(initialVideos);
            setIsLoading(false);
        };
        fetchInitialVideos();
    }, []);

    useEffect(() => {
        // Attach event listener for infinite scrolling
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset]);

    const getSearchResults = (videos: VideoSearch[]) => {
        window.removeEventListener('scroll', handleScroll);
        setVideos(videos);
    }


    return (
        <main>
            <div className='max-w-7xl mx-auto pt-4 text-center'>
                {/* Title */}
                <h1 className='text-4xl font-extrabold'>
                    <span className="bg-gradient-to-r from-indigo-600 to-red-400 text-transparent bg-clip-text">Dr. Martyn LLoyd-Jones</span>
                </h1>

                <p className="mt-2 text-gray-700">Search over 1600 sermons from the Good Doctor. E.g., try <span className="font-semibold">"why do good people suffer?"</span> </p>
                <p className="mt-1 text-gray-700">Sermons indexed from the <a href="https://www.mljtrust.org/" target="_blank" className="hover:underline hover:font-semibold">MLJ Trust's</a> sermon library. </p>

                {/* Search box */}
                <SearchBox
                    getSearchResults={getSearchResults}
                    setGridLoadingStatus={(status: boolean) => setIsLoading(status)}
                />

                {/* Results */}
                {isLoading ? <LoadingSpinner /> : <Grid videos={videos} />}

                {/* Loading spinner for infinite scrolling */}
                {isMoreLoading && <LoadingSpinner />}

            </div>
        </main >
    )
}