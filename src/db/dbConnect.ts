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
        const db = await mongoose.connect(process.env.MONGODB_URL as string);
        connection.isConnected = db.connections[0].readyState;
        console.log("=> New database connection established");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}