import { pipeline, PipelineType } from "@xenova/transformers";
import dbConnect from "@/lib/db/mongodb";
import Embedding from "@/lib/db/models/Embedding";

// Use a singleton pattern to ensure the model is loaded only once in production
class PipelineSingleton {
  static task: PipelineType = "feature-extraction";
  static model = "Xenova/all-MiniLM-L6-v2";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static instance: any = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getInstance(progress_callback: any = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const extractor = await PipelineSingleton.getInstance();

    // Generate embedding
    const output = await extractor(text, { pooling: "mean", normalize: true });

    // Return as array of numbers
    return Array.from(output.data);
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
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
