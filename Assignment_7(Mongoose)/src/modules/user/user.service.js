import { UserModel } from "../../DB/model/user.model.js";

export const signup = async (inputs) => {
  const { email } = inputs;
  const isEmailExist = await UserModel.findOne({ email });

  if (isEmailExist) {
    return { status: 409, message: "Email already exists." };
  }

  const user = await UserModel.create(inputs);
  return { status: 201, user };
};

export const login = async ({ email, password }) => {
  const user = await UserModel.findOne({ email, password });
  if (!user) {
    return { status: 400, message: "Invalid email or password" };
  }

  return { status: 200, user };
};

export const updateUser = async (id, inputs) => {
  const { email, password, ...updateData } = inputs;

  const user = await UserModel.findById(id);
  if (!user) {
    return { error: true, status: 404, message: "User not found" };
  }

  if (email && email !== user.email) {
    const isEmailExist = await UserModel.findOne({ email });
    if (isEmailExist) {
      return { error: true, status: 409, message: "Email already exists." };
    }
    updateData.email = email;
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  return { error: false, data: updatedUser };
};
export const deleteUser = async (id) => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  if (!deletedUser) {
    return { error: true, status: 404, message: "User not found" };
  }
  return { error: false, data: deletedUser };
};
export const getUserById = async (id) => {
  const user = await UserModel.findById(id);

  if (!user) {
    return { error: true, status: 404, message: "User not found" };
  }
  return { error: false, data: user };
};
