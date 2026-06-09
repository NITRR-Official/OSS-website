import mongoose, { Schema, Model, models } from "mongoose";

export interface IPageStats {
  slug: string;
  helpfulCount: number;
  notHelpfulCount: number;
}

const PageStatsSchema = new Schema<IPageStats>(
  {
    slug: { type: String, required: true, unique: true },
    helpfulCount: { type: Number, default: 0 },
    notHelpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PageStats: Model<IPageStats> =
  (models.PageStats as Model<IPageStats>) ||
  mongoose.model<IPageStats>("PageStats", PageStatsSchema);

export default PageStats;
