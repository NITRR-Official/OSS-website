import mongoose, { Schema, Model, models } from "mongoose";
import { Project as IProject } from "@/types";

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    githubUrl: { type: String, required: true },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    openIssues: { type: Number, default: 0 },
    languages: [{ type: String }],
    maintainers: [{ type: String }],
    status: {
      type: String,
      enum: ["Active", "Dormant", "Archived"],
      default: "Active",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    updatedAt: { type: Date, default: Date.now },
    cachedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient querying
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ languages: 1 });
ProjectSchema.index({ cachedAt: -1 });

const Project: Model<IProject> =
  (models.Project as Model<IProject>) || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
