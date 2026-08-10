import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

async function runExplain() {
  await mongoose.connect(process.env.MONGODB_URL as string );

  const db = mongoose.connection.db!;
  const collection = db.collection("telemetrybuckets");

  // First, grab one real document to get an actual vehicleId + hourBucket
  const sample = await collection.findOne();
  if (!sample) {
    console.log("No data found — ingest some telemetry first.");
    process.exit(0);
  }

  console.log("Sample document:", { vehicleId: sample.vehicleId, hourBucket: sample.hourBucket });

  const result = await collection
    .find({ vehicleId: sample.vehicleId, hourBucket: sample.hourBucket })
    .explain("executionStats");

  console.log("Execution stage:", result.executionStats.executionStages.stage);
  console.log("Execution time (ms):", result.executionStats.executionTimeMillis);
  console.log("Documents examined:", result.executionStats.totalDocsExamined);
  console.log("Documents returned:", result.executionStats.nReturned);

  await mongoose.disconnect();
}

runExplain().catch(console.error);