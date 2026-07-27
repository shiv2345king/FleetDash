import "./env.ts";

import { dbConnect } from "./src/db/dbConnect.ts";
import {app} from "./app.ts";

dbConnect().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is running on port ", process.env.PORT || 3000);
    });
}).catch((err) => {
    console.error("Failed to connect to the database", err);
})
