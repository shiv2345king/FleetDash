import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  vehicleId: string;
  geofenceId: mongoose.Types.ObjectId;
  geofenceName: string;
  lat: number;
  lng: number;
  triggeredAt: Date;
}

const AlertSchema = new Schema<IAlert>({
  vehicleId: { type: String, required: true },
  geofenceId: { type: Schema.Types.ObjectId, ref: "Geofence", required: true },
  geofenceName: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  triggeredAt: { type: Date, default: Date.now },
});

AlertSchema.index({ vehicleId: 1, triggeredAt: -1 });

export const Alert = mongoose.model<IAlert>("Alert", AlertSchema);