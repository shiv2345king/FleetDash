import Piscina from "piscina";
import path from "path";

export const ingestionPool = new Piscina({
  filename: path.join(process.cwd(), "src/workers/ingestion.worker.ts"),
  execArgv: ["--import", "tsx"],
  minThreads: 2,
  maxThreads: 4,
});