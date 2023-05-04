'use client'

import supabase from "@/utils/supabase";
import { useState, useEffect } from 'react';
import { SearchBox } from '@/components/SearchBox';

import { Grid } from '@/components/Grid';
import { Video, VideoSearch } from '@/lib/types';
import LoadingSpinner from "@/components/Loading";

const fetchAllVideos = async (limit: number = 10) => {
    const { data, error } = await supabase.from("video").select().limit(10)
    return data;
}

export default function Home() {

    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch all videos and set them as the initial state
        const fetchData = async () => {
            const data = await fetchAllVideos();
            setVideos(data);
        };
        fetchData();
    }, []);


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

            </div>
        </main>
    )
}