import { z } from "zod";
import { generalValidationField } from "../../common/validation.js";

export const loginSchema = (lang = "en") =>
  z.strictObject({
    email: generalValidationField.email(lang),
    password: generalValidationField.password(lang),
  });

export const login = (lang = "en") =>
  z.object({
    body: loginSchema(lang),
  });

export const signup = (lang = "en") => {
  return z.object({
    body: loginSchema(lang)
      .extend({
        username: generalValidationField.username(lang),
        phone: generalValidationField.phone(lang),
        confirmPassword: generalValidationField.confirmPassword(lang),
        confirmEmail: generalValidationField.confirmEmail(lang),
        gender: generalValidationField.gender(lang),
      })
      .superRefine((data, ctx) => {
        generalValidationField.matchFields({
          original: "password",
          copy: "confirmPassword",
          data,
          ctx,
          lang,
        });

        generalValidationField.matchFields({
          original: "email",
          copy: "confirmEmail",
          data,
          ctx,
          lang,
        });

        if (!data.username || !data.username.trim().includes(" ")) {
          ctx.addIssue({
            code: "custom",
            path: ["username"],
            message:
              lang === "ar"
                ? "عفوًا، يجب أن يحتوي اسم المستخدم على مقطعين على الأقل (الاسم الأول والأخير)"
                : "Username must contain at least 2 parts (First and Last name)",
          });
        }
      }),
    query: z.strictObject({}).optional(),
  });
};

export const confirmEmail = (lang = "en") =>
  z.object({
    body: z.strictObject({
      email: generalValidationField.email(lang),
      otp: generalValidationField.otp(lang),
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional(),
  });
export const resendConfirmEmail = (lang = "en") =>
  z.object({
    body: z.strictObject({
      email: generalValidationField.email(lang),
    }),
    query: z.object({}).optional(),
    params: z.object({}).optional(),
  });
export const resetForgotPassword = (lang = "en") =>
  z.object({
    body: z
      .strictObject({
        email: generalValidationField.email(lang),
        otp: generalValidationField.otp(lang),
        password: generalValidationField.password(lang),
        confirmPassword: generalValidationField.confirmPassword(lang),
      })
      .superRefine((data, ctx) => {
        generalValidationField.matchFields({
          original: "password",
          copy: "confirmPassword",
          data,
          ctx,
          lang,
        });
      }),
    query: z.object({}).optional(),
    params: z.object({}).optional(),
  });
