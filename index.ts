import "./env.ts";

import http from "http";
import { dbConnect } from "./src/db/dbConnect.ts";
import { app } from "./app.ts";
import { initSocketServer } from "./src/socket/socketServer.ts";

const httpServer = http.createServer(app);
initSocketServer(httpServer);

dbConnect()
  .then(() => {
    httpServer.listen(process.env.PORT || 3000, () => {
      console.log("Server is running on port ", process.env.PORT || 3000);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });