import mongoose, { Schema, Document } from "mongoose";

interface ITelemetryReading {
  ts: Date;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
}

export interface ITelemetryBucket extends Document {
  vehicleId: string;
  hourBucket: Date;
  readings: ITelemetryReading[];
  count: number;
  firstTs: Date;
  lastTs: Date;
}

const TelemetryReadingSchema = new Schema<ITelemetryReading>(
  {
    ts: { type: Date, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    speed: { type: Number, default: 0 },
    heading: { type: Number, default: 0 },
  },
  { _id: false }
);

const TelemetryBucketSchema = new Schema<ITelemetryBucket>({
  vehicleId: { type: String, required: true },
  hourBucket: { type: Date, required: true },
  readings: { type: [TelemetryReadingSchema], default: [] },
  count: { type: Number, default: 0 },
  firstTs: { type: Date },
  lastTs: { type: Date },
});

// Compound index — this is what you'll prove is <5ms at Mid-Project Review
TelemetryBucketSchema.index({ vehicleId: 1, hourBucket: 1 }, { unique: true });
// For map-viewport time-range queries
TelemetryBucketSchema.index({ hourBucket: -1 });

export const TelemetryBucket = mongoose.model<ITelemetryBucket>(
  "TelemetryBucket",
  TelemetryBucketSchema
);