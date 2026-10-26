import crypto from "node:crypto";
import { ENC_KEY, IV_LENGTH } from "../../config/config.js";

export const encryption = async (plaintext) => {
  if (!plaintext) {
    throw new Error("Plaintext is required for encryption");
  }

  const iv = crypto.randomBytes(Number(IV_LENGTH) || 16);

  const keyBuffer = Buffer.isBuffer(ENC_KEY)
    ? ENC_KEY
    : Buffer.from(ENC_KEY, "utf-8");

  const cipherIv = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);

  let cipherText = cipherIv.update(plaintext, "utf-8", "hex");
  cipherText += cipherIv.final("hex");

  const combinedResult = `${iv.toString("hex")}:${cipherText}`;

  return combinedResult;
};

export const decryption = async (cipherText) => {
  if (!cipherText) {
    throw new Error("CipherText is required for decryption");
  }

  const [hexIV, encryptedData] = cipherText.split(":");

  if (!hexIV || !encryptedData) {
    throw new Error(
      "Invalid cipherText format. Expected 'hexIV:encryptedData'",
    );
  }

  const iv = Buffer.from(hexIV, "hex");

  const keyBuffer = Buffer.isBuffer(ENC_KEY)
    ? ENC_KEY
    : Buffer.from(ENC_KEY, "utf-8");

  const decipherIv = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);

  let plaintext = decipherIv.update(encryptedData, "hex", "utf-8");
  plaintext += decipherIv.final("utf-8");

  return plaintext;
};
