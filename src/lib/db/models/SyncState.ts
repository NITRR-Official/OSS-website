import mongoose, { Schema, Model, models } from "mongoose";
import { SyncState as ISyncState } from "@/types";

const SyncStateSchema = new Schema<ISyncState>(
  {
    key: { type: String, required: true, unique: true },
    lastSyncedAt: { type: Date },
    lastProcessedEventId: { type: Number },
  },
  {
    timestamps: true,
  }
);

SyncStateSchema.index({ key: 1 }, { unique: true });
SyncStateSchema.index({ updatedAt: -1 });

const SyncState: Model<ISyncState> =
  (models.SyncState as Model<ISyncState>) ||
  mongoose.model<ISyncState>("SyncState", SyncStateSchema);

export default SyncState;
