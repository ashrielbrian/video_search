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
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop ===
                document.documentElement.offsetHeight
            ) {
                fetchMoreVideos();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset]);


    return (
        <main>
            <div className='max-w-5xl mx-auto pt-4 text-center'>
                {/* Title */}
                <h1 className='text-4xl font-extrabold'>
                    Dr. Martyn LLoyd-Jones <span className="bg-gradient-to-r from-indigo-500 to-red-200 text-transparent bg-clip-text">Search</span>
                </h1>

                {/* Search box */}
                <SearchBox
                    getSearchResults={(videos: Video[]) => setVideos(videos)}
                    setGridLoadingStatus={(status: boolean) => setIsLoading(status)}
                />

                {/* Results */}
                {isLoading ? <LoadingSpinner /> : <Grid videos={videos} />}

                {/* Loading spinner for infinite scrolling */}
                {isMoreLoading && <LoadingSpinner />}

            </div>
        </main>
    )
}