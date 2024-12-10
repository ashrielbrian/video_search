import { Database } from "./database.types";

type BaseVideo = Database["public"]["Tables"]["video"]["Row"];
export type Segment = Database["public"]["Tables"]["segment"]["Row"];

export type Video = BaseVideo & {
    key?: string;
};

type VideoSegment = {
    segment_id: number;
    content: string;
    similarity: number;
    start_time: number;
    end_time: number;
};

export type VideoSearch = Video & VideoSegment;
