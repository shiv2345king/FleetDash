import Redis from 'ioredis';

export const redisPublisher = new Redis(process.env.REDIS_URL as string);
export const redisSubscriber = new Redis(process.env.REDIS_URL as string);

redisPublisher.on("connect",() => {
    console.log("Redis Publisher connected");
});

redisSubscriber.on("connect",() => {
    console.log("Redis Subscriber connected");
});

redisPublisher.on("error", (err) => console.error("Redis publisher error:", err));
redisSubscriber.on("error", (err) => console.error("Redis subscriber error:", err));

export const TELEMETRY_CHANNEL = "telemetry:updates";