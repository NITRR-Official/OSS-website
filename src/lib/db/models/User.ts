import mongoose, { Schema, Model, models } from "mongoose";
import { ContributionBreakdown, ReputationUser } from "@/types";

const ContributionBreakdownSchema = new Schema<ContributionBreakdown>(
  {
    frontend: { type: Number, default: 0 },
    backend: { type: Number, default: 0 },
    infra: { type: Number, default: 0 },
    docs: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    design: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  { _id: false }
);

const UserSchema = new Schema<ReputationUser>(
  {
    githubId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    displayName: { type: String },
    avatarUrl: { type: String, required: true },
    totalReputation: { type: Number, default: 0 },
    monthlyReputation: { type: Number, default: 0 },
    monthlyReputationMonth: { type: String, required: true },
    currentStreak: { type: Number, default: 0 },
    lastContributionWeekStart: { type: Date },
    isMaintainer: { type: Boolean, default: false },
    contributionBreakdown: { type: ContributionBreakdownSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ totalReputation: -1 });
UserSchema.index({ monthlyReputation: -1 });
UserSchema.index({ username: 1 });
UserSchema.index({ isMaintainer: 1 });

const User: Model<ReputationUser> =
  (models.User as Model<ReputationUser>) || mongoose.model<ReputationUser>("User", UserSchema);

export default User;
