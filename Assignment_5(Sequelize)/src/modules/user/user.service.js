import { UserModel } from "../../DB/model/index.js";

export const signup = async (inputs) => {
  const { name, email, password, role } = inputs;

  const isEmailExist = await UserModel.findOne({ where: { email } });
  if (isEmailExist) {
    throw new Error("Email already exists.", { cause: { status: 409 } });
  }

  const user = UserModel.build({ name, email, password, role });
  await user.save();

  return user;
};

export const upsertUser = async (userData) => {
  const [user, created] = await UserModel.upsert(userData, {
    validate: false,
  });
  return user;
};

export const getUserByEmail = async (email) => {
  const user = await UserModel.findOne({
    where: { email },
  });
  return user;
};

export const getUserById = async (id) => {
  const user = await UserModel.findByPk(id, {
    attributes: { exclude: ["role", "password"] },
  });
  return user;
};
