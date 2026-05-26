import mongoose, { Schema, Model, models } from "mongoose";
import type { ReputationContribution as ReputationContributionType } from "@/types";

const ReputationContributionSchema = new Schema<ReputationContributionType>(
  {
    githubContributionId: { type: String, required: true, unique: true },
    githubPrId: { type: Number, required: true },
    githubReviewId: { type: Number },
    githubRepo: { type: String, required: true },
    userId: { type: String, required: true },
    contributionType: { type: String, required: true },
    difficulty: { type: String, required: true },
    impact: { type: String, required: true },
    exceptional: { type: Boolean, default: false },
    finalScore: { type: Number, required: true },
    mergedAt: { type: Date, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

ReputationContributionSchema.index({ githubContributionId: 1 }, { unique: true });
ReputationContributionSchema.index({ userId: 1, mergedAt: -1 });
ReputationContributionSchema.index({ githubRepo: 1 });

const ReputationContribution: Model<ReputationContributionType> =
  (models.ReputationContribution as Model<ReputationContributionType>) ||
  mongoose.model<ReputationContributionType>(
    "ReputationContribution",
    ReputationContributionSchema
  );

export default ReputationContribution;
