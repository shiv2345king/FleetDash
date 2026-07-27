
import dotenv from "dotenv";
import { dbConnect } from "./db/dbConnect.ts";
const result = dotenv.config();
console.log(result);
async function testDBConnection() {
    try {
        await dbConnect();
        console.log("Database connection test successful.");
    }
    catch (error) {
        console.error("Database connection test failed:", error);
    }
}

testDBConnection();