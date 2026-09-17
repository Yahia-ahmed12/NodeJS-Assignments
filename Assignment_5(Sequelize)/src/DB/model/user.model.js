import { DataTypes } from "sequelize";
import { sequelize } from "../conection.db.js";

export const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email format",
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        checkPasswordLength(value) {
          if (!value || value.length <= 6) {
            throw new Error(
              "Password length must be greater than 6 characters",
            );
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: (user) => {
        if (!user.name || user.name.trim().length <= 2) {
          throw new Error("User name must be greater than 2 characters");
        }
      },
    },
  },
);
