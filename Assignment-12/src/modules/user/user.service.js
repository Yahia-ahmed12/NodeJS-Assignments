import ms from "ms";

import {
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/index.js";
import {
  findById,
  findByIdAndUpdate,
} from "../../common/repository/base.repository.js";
import { envConfig } from "../../config/config.js";
import { UserModel } from "../../DB/model/index.js";
import {
  createLoginCredentials,
  createRevokeToken,
  userBaseRevokeTokenKey,
  userRevokeTokenKey,
} from "../../common/security/token.security.js";
import { decryption } from "../../common/security/encryption.security.js";
import { del, keys, set } from "../../common/services/index.js";
import { LogoutEnum } from "../../common/security/security.enum.js";
export const profile = async (userId) => {
  const account = await findById({
    model: UserModel,
    id: userId,
    options: {
      select: "-password",
      lean: true,
    },
  });

  if (!account) {
    throw NotFoundException({ message: "User not found" });
  }

  if (account.phone && account.phone.includes(":")) {
    try {
      account.phone = await decryption(account.phone);
    } catch (error) {
      console.error(
        `Failed to decrypt phone for user ${userId}:`,
        error.message,
      );
      account.phone = null;
    }
  }

  return account;
};

export const updateProfileImageService = async ({ userId, file }) => {
  const updatedUser = await findByIdAndUpdate({
    id: userId,
    update: { image: file.finalPath },
    model: UserModel,
  });

  return updatedUser;
};
export const update = async (user, data) => {
  const account = await findByIdAndUpdate({
    model: UserModel,
    id: user._id,
    update: data,
  });

  if (!account) {
    throw NotFoundException({ message: "User not found" });
  }

  return account;
};

export const rotateToken = async (payload, issuer) => {
  const expiresInMs = ms(envConfig.jwt.access.expiresIn || "30m");
  const accessExpiresIn = payload.iat * 1000 + expiresInMs;

  const currentTime = Date.now();
  const guardTime = currentTime + 5 * 60 * 1000;

  if (guardTime < accessExpiresIn) {
    throw ConflictException({
      message:
        "Sorry, we cannot create new login credentials while current access token is still valid",
    });
  }

  const user = await findById({ model: UserModel, id: payload.sub });
  if (!user) {
    throw NotFoundException({ message: "User account no longer exists" });
  }

  const data = await createLoginCredentials({
    user,
    issuer,
  });
  await createRevokeToken({ payload });
  return data;
};
export const logout = async (payload, user, { action = LogoutEnum.DEVICE }) => {
  switch (action) {
    case LogoutEnum.ALL: {
      user.changeCredentialsTime = new Date();
      await user.save();

      const pattern = `${userBaseRevokeTokenKey({ userId: payload.sub })}*`;
      console.log("Search Pattern:", pattern);

      const foundKeys = await keys(pattern);
      console.log("Found Keys in Redis:", foundKeys);

      if (foundKeys && foundKeys.length > 0) {
        await del({ key: foundKeys });
      }
      break;
    }

    default:
      await createRevokeToken({ payload });
      break;
  }
};
