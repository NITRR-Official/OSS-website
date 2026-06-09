import mongoose, { Schema, Model, models } from "mongoose";

export interface IEmbedding {
  slug: string;
  type: "blog" | "resource";
  title: string;
  text: string;
  embedding: number[];
}

const EmbeddingSchema = new Schema<IEmbedding>(
  {
    slug: { type: String, required: true },
    type: { type: String, required: true, enum: ["blog", "resource"] },
    title: { type: String, required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
  },
  { timestamps: true }
);

EmbeddingSchema.index({ slug: 1, type: 1 }, { unique: true });

const Embedding: Model<IEmbedding> =
  (models.Embedding as Model<IEmbedding>) ||
  mongoose.model<IEmbedding>("Embedding", EmbeddingSchema);

export default Embedding;
