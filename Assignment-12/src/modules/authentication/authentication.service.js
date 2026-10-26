import { ProviderEnum, RoleEnum } from "../../common/enum/user.enum.js";
import {
  BadException,
  ConflictException,
  NotFoundException,
  TooManyRequestException,
  UnauthorizedException,
} from "../../common/exceptions/index.js";
import {
  findOne,
  createOne,
  findOneAndUpdate,
} from "../../common/repository/index.js";
import {
  compare,
  hash,
  encryption,
  createLoginCredentials,
  HashApproachEnum,
  userBaseRevokeTokenKey,
} from "../../common/security/index.js";
import { UserModel } from "../../DB/model/user.model.js";
import { OAuth2Client } from "google-auth-library";
import { WEB_CLIENT_IDS } from "../../config/config.js";
import {
  createNumberOtp,
  emailEvent,
  UserEmailKey,
  UserEmailTrailsKey,
  UserLoginTrailsKey,
} from "../../common/utils/index.js";
import { EmailSubjectEnum } from "../../common/enum/email.enum.js";
import {
  del,
  expire,
  get,
  incrBy,
  keys,
  set,
  ttl,
} from "../../common/services/index.js";
/*
{
  iss: 'https://accounts.google.com',
  azp: '238122493302-hk93am3dvrnt4ebj1ckl53je7n6mqoom.apps.googleusercontent.com',
  aud: '238122493302-hk93am3dvrnt4ebj1ckl53je7n6mqoom.apps.googleusercontent.com',
  sub: '110961836876461904736',
  email: 'yahiafana@gmail.com',
  email_verified: true,
  nbf: 1791197437,
  name: 'Yahia ahmed',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocIZsmZ5D-xOD_7g2zWktn2fsckQJ-4qCsxXetB0G0kOyg766fcS6w=s96-c',
  given_name: 'Yahia',
  family_name: 'ahmed',
  iat: 1791197737,
  exp: 1791201337,
  jti: 'ee92fa7f8a2a463c7f11b069728bfe7e9d8a31de'
}

*/
const client = new OAuth2Client();
export const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: WEB_CLIENT_IDS,
    });

    const payload = ticket.getPayload();
    if (!payload.email_verified) {
      throw BadException("email not verified");
    }
    return payload;
  } catch (error) {
    throw new Error("Invalid Google Token");
  }
};

export const signupWithGmail = async ({ idToken }, issuer) => {
  console.log({ idToken });
  const { name, email, picture } = await verifyGoogleToken(idToken);
  console.log({ name, email, picture });
  const existAccount = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (existAccount) {
    if (existAccount.provider != ProviderEnum.GOOGLE) {
      throw ConflictException("Invalid account provider");
    }
    const tokens = await createLoginCredentials({ user: existAccount, issuer });
    return { tokens, isNewUser: false };
  }
  // add user
  const user = await createOne({
    model: UserModel,
    data: {
      username: name,
      email,
      confirmEmail: new Date(),
      provider: ProviderEnum.GOOGLE,
      image: picture,
      changeCredentialsTime: null,
    },
  });
  const tokens = await createLoginCredentials({ user, issuer });
  return { tokens, isNewUser: true };
};
const sendEmailOtp = async ({
  email,
  subject,
  expiresIn = 120,
  maxTrials = 3,
  blockInSecond = 300,
}) => {
  const remainingTtl = await ttl({
    key: UserEmailKey({
      email,
      subject,
    }),
  });

  if (remainingTtl > 0) {
    throw BadException({
      message: `Please wait before requesting a new code. Try again after ${remainingTtl} seconds.`,
    });
  }

  const currentTrails = await get({
    key: UserEmailTrailsKey({ email, subject }),
  });

  let trialsCount = Number(currentTrails) || 0;

  if (trialsCount >= maxTrials) {
    throw TooManyRequestException({
      message: "Too many trials. Please try again later.",
    });
  }

  const code = createNumberOtp();

  await set({
    key: UserEmailKey({
      email,
      subject,
    }),
    value: await hash({ plaintext: code.toString() }),
    ttl: expiresIn,
  });

  trialsCount = await incrBy({ key: UserEmailTrailsKey({ email, subject }) });

  if (trialsCount === maxTrials) {
    await expire({
      key: UserEmailTrailsKey({ email, subject }),
      ttl: blockInSecond,
    });
  }

  let emailTitle = "Welcome to Sarha App! 🎉";
  let emailMessage =
    "Please use the confirmation code below to activate your account:";

  if (subject === EmailSubjectEnum.FORGOT_PASSWORD) {
    emailTitle = "Reset Your Password 🔐";
    emailMessage = "Please use the code below to reset your password:";
  }

  emailEvent.emit("sendEmail", {
    recipients: { to: email },
    subject: subject,
    data: {
      title: emailTitle,
      message: emailMessage,
      code: code,
    },
  });
};
export const signup = async ({ email, password, username, phone }) => {
  const duplicatedAccount = await findOne({
    model: UserModel,
    filter: { email },
    options: { select: "email" },
  });

  if (duplicatedAccount) {
    throw ConflictException({
      message: "Email Exist",
      issues: [{ path: "email", message: "Email is already in use" }],
    });
  }

  const hashedPassword = await hash({
    plaintext: password,
    approach: HashApproachEnum.BCRYPT,
  });

  const account = await createOne({
    model: UserModel,
    data: {
      email,
      username,
      password: hashedPassword,
      phone: await encryption(phone),
      role: RoleEnum.USER,
      changeCredentialsTime: null,
    },
  });
  await sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });
  return account;
};
export const confirmEmail = async ({ email, otp }) => {
  const redisKey = UserEmailKey({
    email,
    subject: EmailSubjectEnum.CONFIRM_EMAIL,
  });

  const hashedOtp = await get({ key: redisKey });

  if (!hashedOtp) {
    throw BadException({
      message: "Invalid or expired OTP",
    });
  }

  const isMatch = await compare({ plaintext: otp, cipherText: hashedOtp });

  if (!isMatch) {
    throw BadException({
      message: "Invalid OTP code",
    });
  }

  const account = await findOneAndUpdate({
    model: UserModel,
    filter: { email, provider: ProviderEnum.SYSTEM },
    update: { confirmEmail: new Date() },
    options: { new: true },
  });

  if (!account) {
    throw NotFoundException({
      message: "Account not found",
    });
  }

  const matchedKeys = await keys(`${redisKey}*`);

  if (matchedKeys && matchedKeys.length > 0) {
    await del({ key: matchedKeys });
  }

  return { message: "Email confirmed successfully" };
};
export const resendConfirmEmail = async ({ email }) => {
  const account = await findOne({
    model: UserModel,
    filter: { email, provider: ProviderEnum.SYSTEM },
  });

  if (!account) {
    throw NotFoundException({
      message: "Account not found",
    });
  }

  if (account.confirmEmail) {
    throw ConflictException({
      message: "Email is already confirmed",
    });
  }

  await sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });

  return { message: "OTP resent successfully" };
};
export const requestForgotPasswordCode = async ({ email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!account) {
    throw NotFoundException({
      message: "Account not found",
    });
  }

  await sendEmailOtp({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD });

  return { message: "Password reset code sent successfully" };
};
export const verifyForgotPasswordCode = async ({ email, otp }) => {
  const redisKey = UserEmailKey({
    email,
    subject: EmailSubjectEnum.FORGOT_PASSWORD,
  });

  const hashedOtp = await get({ key: redisKey });

  if (!hashedOtp) {
    throw BadException({
      message: "Invalid or expired OTP",
    });
  }

  const isMatch = await compare({ plaintext: otp, cipherText: hashedOtp });

  if (!isMatch) {
    throw BadException({
      message: "Invalid OTP code",
    });
  }

  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!account) {
    throw NotFoundException({
      message: "Account not found",
    });
  }

  return account;
};
export const resetForgotPassword = async ({ email, otp, password }) => {
  const account = await verifyForgotPasswordCode({ otp, email });

  account.password = await hash({ plaintext: password });
  account.changeCredentialsTime = new Date();
  await account.save();

  const redisKey = UserEmailKey({
    email,
    subject: EmailSubjectEnum.FORGOT_PASSWORD,
  });

  const trailsKey = UserEmailTrailsKey({
    email,
    subject: EmailSubjectEnum.FORGOT_PASSWORD,
  });

  const [matchedKeys, revokeKeys] = await Promise.all([
    keys(`${redisKey}*`),
    keys(`${userBaseRevokeTokenKey({ userId: account._id })}*`),
  ]);

  const keysToDelete = [...(matchedKeys || []), trailsKey];

  const deletePromises = [];
  if (keysToDelete.length > 0) {
    deletePromises.push(del({ key: keysToDelete }));
  }

  if (revokeKeys && revokeKeys.length > 0) {
    deletePromises.push(del({ key: revokeKeys }));
  }

  if (deletePromises.length > 0) {
    await Promise.all(deletePromises);
  }

  return { message: "Password reset successfully" };
};
export const login = async (
  { email, password, maxTrials = 5, blockInSecond = 300 },
  issuer,
) => {
  const remainingTtl = await ttl({
    key: UserLoginTrailsKey({ email }),
  });

  if (remainingTtl > 0) {
    throw TooManyRequestException({
      message: `Too many failed login attempts. Please try again after ${remainingTtl} seconds.`,
    });
  }

  const user = await findOne({
    model: UserModel,
    filter: { email, provider: ProviderEnum.SYSTEM },
  });

  if (!user) {
    throw NotFoundException({ message: "Invalid email or password" });
  }

  if (!user.confirmEmail) {
    throw UnauthorizedException({ message: "Please confirm your email first" });
  }

  const match = await compare({
    plaintext: password,
    cipherText: user.password,
    approach: HashApproachEnum.BCRYPT,
  });

  if (!match) {
    let trialsCount = await incrBy({
      key: UserLoginTrailsKey({ email }),
    });

    if (trialsCount >= maxTrials) {
      await expire({
        key: UserLoginTrailsKey({ email }),
        ttl: blockInSecond,
      });

      throw TooManyRequestException({
        message: "Too many failed trials. Your account is temporarily blocked.",
      });
    }

    throw UnauthorizedException({
      message: "Invalid email or password",
    });
  }

  await del({
    key: UserLoginTrailsKey({ email }),
  });

  return await createLoginCredentials({
    user,
    issuer,
  });
};
