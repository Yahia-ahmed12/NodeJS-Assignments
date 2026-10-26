import mongoose from "mongoose";
import dns from "node:dns";
import { DB_URI } from "../config/config.js";
import { UserModel } from "./model/user.model.js";
import { connectRedis } from "./redis.connection.js";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

export const bootstrapDB = async (app, port = 3000) => {
  try {
    await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 30000 });
    await UserModel.syncIndexes();
    console.log(`DB connected Successfully 🌸 `);
    await connectRedis();
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`),
    );
  } catch (error) {
    console.log(error);
    console.log(`Fail to connect on DB ✖️`);
  }
};
