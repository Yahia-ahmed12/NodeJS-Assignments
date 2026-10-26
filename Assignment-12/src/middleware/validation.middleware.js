import { BadException } from "../common/exceptions/global-error.exception.js";
import { LanguageEnum } from "../common/security/security.enum.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const lang = Number(req.headers["accept-language"] ?? LanguageEnum.EN);
    const validationResult = schema(lang).safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!validationResult.success) {
      throw BadException({
        message: "Validation Error",
        issues: validationResult.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    req.validate = validationResult.data;
    next();
  };
};
