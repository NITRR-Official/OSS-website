import mongoose, { Schema, Model, models } from "mongoose";
import { Contributor as IContributor, Contribution } from "@/types";

const ContributionSchema = new Schema<Contribution>({
  repo: { type: String, required: true },
  prNumber: { type: Number, required: true },
  points: { type: Number, required: true },
  mergedAt: { type: Date, required: true },
});

const ContributorSchema = new Schema<IContributor>(
  {
    githubUsername: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    name: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    githubUrl: { type: String, required: true },
    points: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    prsMerged: { type: Number, default: 0 },
    totalPRs: { type: Number, default: 0 },
    projectsContributed: [{ type: String }],
    projectsContributedTo: [{ type: String }],
    contributions: [ContributionSchema],
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create indexes
ContributorSchema.index({ points: -1 });
ContributorSchema.index({ githubUsername: 1 });
ContributorSchema.index({ updatedAt: -1 });

const Contributor: Model<IContributor> =
  (models.Contributor as Model<IContributor>) ||
  mongoose.model<IContributor>("Contributor", ContributorSchema);

export default Contributor;
