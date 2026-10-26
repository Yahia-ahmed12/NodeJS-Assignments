import { z } from "zod";
import { GenderEnum } from "./enum/user.enum.js";
import { LanguageEnum } from "./security/security.enum.js";

const validationMessages = {
  101: {
    ar: "عفوًا، البريد الإلكتروني غير صحيح، برجاء إدخال إيميل صالح",
    en: "Invalid email format. Please provide a valid email address.",
  },
  102: {
    ar: "عفوًا، لا يمكن إدخال اسم المستخدم أقل من ثلاثة أحرف",
    en: "Username must be at least 3 characters long.",
  },
  103: {
    ar: "عفوًا، كلمة المرور يجب ألا تقل عن 8 أحرف ولا تزيد عن 25 حرفًا",
    en: "Password must be at least 8 characters long and cannot exceed 25 characters.",
  },
  104: {
    ar: "عفوًا، صيغة رقم الهاتف غير صحيحة",
    en: "Invalid phone number format. Please use a valid E.164 format.",
  },
  105: {
    ar: "عفوًا، نوع الجنس غير صالح",
    en: "Invalid gender selection.",
  },
  106: {
    ar: "عفوًا، البريد الإلكتروني للتأكيد غير صالح",
    en: "Invalid confirm email format. Please provide a valid email address.",
  },
  107: {
    ar: "عفوًا، تأكيد كلمة المرور يجب ألا يقل عن 8 أحرف ولا يزيد عن 25 حرفًا",
    en: "Confirm password must be at least 8 characters long and cannot exceed 25 characters.",
  },
  108: {
    ar: "عفوًا، الحقلان غير متطابقان",
    en: "Fields do not match",
  },
  109: {
    ar: "رمز التحقق غير صالح، يجب أن يتكون من 6 أرقام",
    en: "Invalid OTP, must be 6 digits",
  },
};

export const getValidationMessage = (lang, code) => {
  return lang === LanguageEnum.AR
    ? validationMessages[code]?.ar
    : validationMessages[code]?.en;
};

const matchFields = ({ original, copy, data, ctx, lang = "en" }) => {
  if (data[original] !== data[copy]) {
    ctx.addIssue({
      code: "custom",
      message: getValidationMessage(lang, 108),
      path: [copy],
    });
  }
};

export const generalValidationField = {
  email: (lang = "en") =>
    z.string().email({
      message: getValidationMessage(lang, 101),
    }),

  confirmEmail: (lang = "en") =>
    z.string().email({
      message: getValidationMessage(lang, 106),
    }),

  password: (lang = "en") =>
    z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*\s{0,})(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,16}$/,
      )
      .min(8, { message: getValidationMessage(lang, 103) })
      .max(25, { message: getValidationMessage(lang, 103) }),

  confirmPassword: (lang = "en") =>
    z
      .string()
      .min(8, { message: getValidationMessage(lang, 107) })
      .max(25, { message: getValidationMessage(lang, 107) }),

  username: (lang = "en") =>
    z.string().min(3, {
      message: getValidationMessage(lang, 102),
    }),

  phone: (lang = "en") =>
    z.e164({
      message: getValidationMessage(lang, 104),
    }),

  gender: (lang = "en") =>
    z.nativeEnum(GenderEnum, {
      message: getValidationMessage(lang, 105),
    }),
  otp: (lang = "en") =>
    z.string().regex(/^\d{6}$/, {
      message: getValidationMessage(lang, 109),
    }),
  matchFields,
};
