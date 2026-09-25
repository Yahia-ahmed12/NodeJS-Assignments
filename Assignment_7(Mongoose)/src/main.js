import express from "express";
import cors from "cors";
import { globalErrorHandling } from "./middleware/error.middleware.js";
import { bootstrapDB } from "./DB/conection.db.js";
import { PORT } from "./config/config.js";
import { userController, noteController } from "./modules/index.js";
const app = express();
const port = PORT;

console.log(process.env.NODE_ENV);
bootstrapDB(app, port);
app.all("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to BE API 🌸" });
});
app.use(cors(), express.json());
app.use("/user", userController);
app.use("/note", noteController);

app.all("{/*dummy}", (req, res) => {
  return res.status(404).json({ message: "Invalid applictio routingn" });
});

app.use(globalErrorHandling);
