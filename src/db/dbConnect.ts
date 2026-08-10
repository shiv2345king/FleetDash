import mongoose from "mongoose";

type ConnectionType = {
    isConnected: number;
}

const connection: ConnectionType = {
    isConnected: 0,
};

export async function dbConnect() {

    if (connection.isConnected) {
        console.log("=> Using existing database connection");
        return;
    }

    try {
        const isTest = process.env.NODE_ENV === "test";
        const db = await mongoose.connect(process.env.MONGODB_URL as string, {
            maxPoolSize: isTest ? 10 : 50,
            minPoolSize: isTest ? 1 : 10,
        });
        connection.isConnected = db.connections[0].readyState;
        console.log("=> New database connection established");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}