import mongoose, { Schema, Document } from "mongoose";

export interface IGeofence extends Document {
  name: string;
  vehicleId?: string; // optional: if set, zone applies only to this vehicle
  polygon: {
    type: "Polygon";
    coordinates: number[][][]; // GeoJSON format: [[[lng,lat],[lng,lat],...]]
  };
  active: boolean;
}

const GeofenceSchema = new Schema<IGeofence>({
  name: { type: String, required: true },
  vehicleId: { type: String, default: null },
  polygon: {
    type: { type: String, enum: ["Polygon"], required: true },
    coordinates: { type: [[[Number]]], required: true },
  },
  active: { type: Boolean, default: true },
});

GeofenceSchema.index({ polygon: "2dsphere" });

export const Geofence = mongoose.model<IGeofence>("Geofence", GeofenceSchema);