import { Database } from "./database.types"

export type Video = Database['public']['Tables']['video']['Row'];
export type Segment = Database['public']['Tables']['segment']['Row'];

type VideoSegment = {
    segment_id: number
    content: string
    similarity: number
    start_time: number
    end_time: number
}

export type VideoSearch = Video & VideoSegment;


