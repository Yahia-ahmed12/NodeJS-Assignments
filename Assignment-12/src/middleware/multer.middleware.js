import { processMulterUpload } from "../common/utils/index.js";

export const uploadMiddleware = ({
  isRequired = true,
  multerMiddleware,
  customPath = "general",
  validation = [],
}) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (error) => {
      if (error) {
        return next(new Error(error.message, { cause: { status: 400 } }));
      }

      const hasSingleFile = req.file;
      const hasArrayFiles = Array.isArray(req.files) && req.files.length > 0;
      const hasObjectFiles =
        req.files &&
        typeof req.files === "object" &&
        Object.keys(req.files).length > 0 &&
        Object.values(req.files).some(
          (arr) => Array.isArray(arr) && arr.length > 0,
        );

      if (isRequired && !hasSingleFile && !hasArrayFiles && !hasObjectFiles) {
        return next(new Error("file is required", { cause: { status: 400 } }));
      }

      if (!hasSingleFile && !hasArrayFiles && !hasObjectFiles) {
        return next();
      }

      processMulterUpload({ customPath, validation })(req, res, next);
    });
  };
};
