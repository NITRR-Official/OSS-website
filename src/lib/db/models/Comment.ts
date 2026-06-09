import mongoose, { Schema, Model, models } from "mongoose";

export interface IComment {
  slug: string;
  type: "blog" | "resource";
  authorName: string;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    slug: { type: String, required: true, index: true },
    type: { type: String, required: true, enum: ["blog", "resource"] },
    authorName: { type: String, required: true },
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Comment: Model<IComment> =
  (models.Comment as Model<IComment>) || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
