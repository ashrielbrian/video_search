import { NextResponse } from "next/server";
import supabase from "@/utils/supabase";
import { Configuration, OpenAIApi } from "openai";

const getEmbedding = async (query: string) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    console.log("Waiting for OpenAI...");
    const embeddingResp = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: query,
    });
    console.log("Embeddings returned.");

    const [{ embedding }] = embeddingResp.data.data;
    const bestResults = await search(embedding);

    return bestResults;
};

const search = async (queryEmbedding: number[]) => {
    const results = await supabase.rpc("search_segment", {
        query_embedding: JSON.stringify(queryEmbedding),
        similarity_threshold: 0.78,
        match_count: 10,
    });

    return results.data?.map((item) => ({
        ...item,
        key: item.id + "_" + item.segment_id,
    }));
};

export async function POST(request: Request) {
    const { query } = await request.json();

    if (query) {
        const results = await getEmbedding(query);
        return NextResponse.json({ results });
    }
}
