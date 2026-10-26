import { createClient } from "redis";
import { REDIS_URI } from "../config/config.js";
export const client = createClient({
  url: REDIS_URI,
});
client.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});
export async function connectRedis() {
  try {
    await client.connect();
    console.log(`Redis connection stablish successfully 🚀`);
  } catch (error) {
    console.log(`Fail to establish Redis connection ❌`);
  }
}
