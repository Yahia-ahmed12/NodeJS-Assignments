import bcrypt from "bcrypt";
import argon2 from "argon2";
import { SALT } from "../../config/config.js";
import { HashApproachEnum } from "./index.js";

/**
 * Hash plaintext using bcrypt or argon2
 */
export const hash = async ({
  plaintext,
  salt_round = Number(SALT) || 10,
  minor = "b",
  approach = HashApproachEnum.BCRYPT,
}) => {
  if (!plaintext) {
    throw new Error("Plaintext is required for hashing.");
  }

  let cipherText = undefined;

  switch (approach) {
    case HashApproachEnum.BCRYPT: {
      const saltSignature = await bcrypt.genSalt(salt_round, minor);
      cipherText = await bcrypt.hash(plaintext, saltSignature);
      break;
    }
    case HashApproachEnum.argon2: {
      cipherText = await argon2.hash(plaintext);
      break;
    }
    default: {
      const saltSignature = await bcrypt.genSalt(salt_round, minor);
      cipherText = await bcrypt.hash(plaintext, saltSignature);
      break;
    }
  }

  return cipherText;
};

/**
 * Compare plaintext with cipherText using bcrypt or argon2
 */
export const compare = async ({
  plaintext,
  cipherText,
  approach = HashApproachEnum.BCRYPT,
}) => {
  if (!plaintext || !cipherText) {
    throw new Error("Both plaintext and cipherText are required for compare.");
  }

  let isMatch = false;

  switch (approach) {
    case HashApproachEnum.BCRYPT: {
      isMatch = await bcrypt.compare(plaintext, cipherText);
      break;
    }
    case HashApproachEnum.argon2: {
      isMatch = await argon2.verify(cipherText, plaintext);
      break;
    }
    default: {
      isMatch = await bcrypt.compare(plaintext, cipherText);
      break;
    }
  }

  return isMatch;
};
