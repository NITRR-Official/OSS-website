import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db/mongodb";
import Embedding from "@/lib/db/models/Embedding";

// Ensure we have an API key
const API_KEY = process.env.GEMINI_API_KEY || "";
let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  // Use the default stable gemini-embedding-001 model (768 dimensions)
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function searchContent(query: string, type?: "blog" | "resource", limit = 5) {
  await dbConnect();

  const queryEmbedding = await generateEmbedding(query);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipeline: any[] = [
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: limit * 10,
        limit,
      },
    },
    {
      $project: {
        _id: 0,
        slug: 1,
        type: 1,
        title: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ];

  if (type) {
    pipeline.push({ $match: { type } });
  }

  const results = await Embedding.aggregate(pipeline);
  return results;
}
