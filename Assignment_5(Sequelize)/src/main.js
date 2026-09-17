import express from "express";
import { PORT } from "./config/config.js";
import { bootstrapDB } from "./DB/conection.db.js";
import { globalErrorHandling } from "./middleware/error.middleware.js";
import { userRouter, postRouter, commentRouter } from "./modules/index.js";

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.all("{*splat}", (req, res) => {
  res.status(404).json({ message: "Route not found", status: 404 });
});

app.use(globalErrorHandling);

await bootstrapDB(app, PORT);
