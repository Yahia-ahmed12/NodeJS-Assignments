import jwt from "jsonwebtoken";
import { envConfig } from "../../config/config.js";
import {
  BadException,
  NotFoundException,
  UnauthorizedException,
} from "../exceptions/global-error.exception.js";
import { UserModel } from "../../DB/model/user.model.js";
import { findById, findOne } from "../repository/base.repository.js";
import { TokenTypeEnum } from "../enum/token-security.enum.js";
import { RoleEnum } from "../enum/user.enum.js";
import { compare } from "bcrypt";
import { randomUUID } from "node:crypto";
import { exist, set } from "../services/index.js";
export const userBaseRevokeTokenKey = ({ userId }) => {
  return `User::${userId.toString()}::Revoke_Token`;
};

export const userRevokeTokenKey = ({ userId, jti }) => {
  return `${userBaseRevokeTokenKey({ userId })}::${jti}`;
};
export const createToken = async ({
  payload = {},
  options = {},
  secret = envConfig.jwt.access.userSignature,
} = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async ({
  token = "",
  secret = envConfig.jwt.access.userSignature,
} = {}) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw UnauthorizedException({
        message: "Token has expired, please refresh or login again",
      });
    }
    throw UnauthorizedException({ message: "Invalid or corrupted token" });
  }
};

export const getSignature = async ({
  tokenType = TokenTypeEnum.ACCESS,
  role = (role = RoleEnum.USER),
} = {}) => {
  const isAdmin = role === RoleEnum.ADMIN;
  let secret;

  if (tokenType === TokenTypeEnum.ACCESS) {
    secret = isAdmin
      ? envConfig.jwt.access.adminSignature
      : envConfig.jwt.access.userSignature;
  } else if (tokenType === TokenTypeEnum.REFRESH) {
    secret = isAdmin
      ? envConfig.jwt.refresh.adminSignature
      : envConfig.jwt.refresh.userSignature;
  } else {
    throw BadException({ message: "Invalid token type" });
  }

  if (!secret) {
    throw BadException({ message: "JWT Secret configuration is missing" });
  }

  return secret;
};

export const decodeToken = async ({
  authorization = "",
  tokenType = TokenTypeEnum.ACCESS,
} = {}) => {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw UnauthorizedException({
      message: "Missing or malformed authorization token",
    });
  }

  const token = authorization.split(" ")[1];

  const decoded = jwt.decode(token);

  if (!decoded) {
    throw UnauthorizedException({ message: "Invalid token format" });
  }

  const userRole = decoded?.audience?.[0] || decoded?.role || "user";

  const secret = await getSignature({ tokenType, role: userRole });

  const payload = await verifyToken({
    token,
    secret,
  });

  if (
    await exist({
      key: userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
    })
  ) {
    throw UnauthorizedException({ message: "Expired login credentials" });
  }
  const userId = payload?.sub || payload?.id || payload?._id;

  if (!userId) {
    throw BadException({ message: "Missing token payload" });
  }

  const user = await findById({
    model: UserModel,
    id: userId,
  });

  if (!user) {
    throw NotFoundException({ message: "User not found or deleted" });
  }

  if ((user.changeCredentialsTime?.getTime() ?? 0) > payload.iat * 1000) {
    throw UnauthorizedException({ message: "Expired login credentials" });
  }
  return { user, payload };
};
export const createLoginCredentials = async ({ user, issuer }) => {
  const jwtid = randomUUID();
  const userRole = user?.role || "user";

  const isSystemAdmin = userRole === "admin" || userRole === "superAdmin";

  const accessSecret = isSystemAdmin
    ? envConfig.jwt.access.adminSignature
    : envConfig.jwt.access.userSignature;

  const refreshSecret = isSystemAdmin
    ? envConfig.jwt.refresh.adminSignature
    : envConfig.jwt.refresh.userSignature;

  const access_token = await createToken({
    payload: {
      sub: user._id.toString(),
      role: userRole,
    },
    secret: accessSecret,
    options: {
      expiresIn: envConfig.jwt.access.expiresIn,
      issuer,
      jwtid,
    },
  });

  const refresh_token = await createToken({
    payload: {
      sub: user._id.toString(),
    },
    secret: refreshSecret,
    options: {
      expiresIn: envConfig.jwt.refresh.expiresIn,
      issuer,
      jwtid,
    },
  });

  return { access_token, refresh_token };
};
export const createRevokeToken = async ({ payload }) => {
  const consumedTime = Math.ceil(Date.now() / 1000) - payload.iat;

  const refreshDays = parseInt(envConfig.jwt.refresh.expiresIn);
  const refreshExpiresInSeconds = refreshDays * 24 * 60 * 60;

  const refreshExpiresIn = payload.iat + refreshExpiresInSeconds;
  const ttl = refreshExpiresIn - consumedTime;

  console.log({ payload, consumedTime, refreshExpiresIn, ttl });

  await set({
    key: userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
    value: payload.jti,
    ttl,
  });

  return;
};
export const basicAuth = async ({ email, password }) => {
  const user = await findOne({
    model: UserModel,
    filter: {
      email,
    },
  });

  if (!user) throw NotFoundException({ message: "User not found" });

  const match = await compare(password, user.password);

  if (!match) throw NotFoundException({ message: "Invalid credentials" });
  return user;
};
