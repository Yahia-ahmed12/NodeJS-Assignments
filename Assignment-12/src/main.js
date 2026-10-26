import express from "express";
import cors from "cors";

import {
  authenticationController,
  messageController,
  userController,
} from "./modules/index.js";
import { globalErrorHandling } from "./middleware/error.middleware.js";

import { PORT } from "./config/config.js";
import { bootstrapDB } from "./DB/conection.db.js";
import { keys, set } from "./common/services/index.js";

const app = express();
const port = PORT || 3000;

app.use(cors(), express.json());
app.use("/assets", express.static("./assets"));
await bootstrapDB(app, port);
await set({ key: "userage", value: 21, ttl: 60 });
await set({ key: "usergender", value: { type: "male" }, ttl: 60 });
console.log(await keys("user*"));
app.all("/", async (req, res) => {
  return res.status(200).json({ message: "Welcome to BE API 🌸" });
});

app.use("/auth", authenticationController);
app.use("/message", messageController);
app.use("/user", userController);

app.all("{/*dummy}", (req, res) => {
  return res.status(404).json({ message: "Invalid application routing" });
});

app.use(globalErrorHandling);
