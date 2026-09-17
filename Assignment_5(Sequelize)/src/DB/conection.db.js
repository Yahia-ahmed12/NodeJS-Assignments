import { Sequelize } from "sequelize";
import {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} from "../config/config.js";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
});

export const bootstrapDB = async (app, port) => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully ✅");

    await import("./model/index.js");

    await sequelize.sync({ alter: false });
    console.log("Models synchronized successfully 🔄");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database ❌:", error);
  }
};
