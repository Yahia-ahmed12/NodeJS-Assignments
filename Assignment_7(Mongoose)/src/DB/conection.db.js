import dns from "node:dns";
import mongoose from "mongoose";
import { DB_URI } from "../config/config.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
export const bootstrapDB = async (app, port = 3000) => {
  try {
    await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`DB connected Successfully 🌸`);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    console.log(`Fail to connect on DB ✖️`);
  }
};
