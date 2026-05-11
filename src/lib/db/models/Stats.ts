import mongoose, { Schema, Model, models } from "mongoose";
import { OrgStats as IOrgStats, ActivityData } from "@/types";

const ActivityDataSchema = new Schema<ActivityData>({
  month: { type: String, required: true },
  commits: { type: Number, required: true },
  prs: { type: Number, required: true },
  issues: { type: Number, required: true },
});

const OrgStatsSchema = new Schema<IOrgStats>(
  {
    totalProjects: { type: Number, default: 0 },
    totalContributors: { type: Number, default: 0 },
    totalPRsMerged: { type: Number, default: 0 },
    totalPRs: { type: Number, default: 0 },
    totalStars: { type: Number, default: 0 },
    activeMaintainers: { type: Number, default: 0 },
    projectsByStatus: {
      active: { type: Number, default: 0 },
      dormant: { type: Number, default: 0 },
      archived: { type: Number, default: 0 },
    },
    activityData: [ActivityDataSchema],
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create index
OrgStatsSchema.index({ updatedAt: -1 });

const OrgStats: Model<IOrgStats> =
  (models.OrgStats as Model<IOrgStats>) || mongoose.model<IOrgStats>("OrgStats", OrgStatsSchema);

export default OrgStats;
