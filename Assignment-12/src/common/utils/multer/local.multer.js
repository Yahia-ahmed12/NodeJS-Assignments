import multer from "multer";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { error } from "node:console";
import { stat } from "node:fs";

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/gif"],
  files: ["application/pdf", "application/json"],
};

export const localFileUpload = ({ maxFileSize = 5, validation = [] } = {}) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid format", { cause: { status: 400 } }), false);
    }
  };

  return multer({
    fileFilter,
    storage,
    limits: { fileSize: maxFileSize * 1024 * 1024 },
  });
};

export const processFile = async ({
  customPath = "general",
  file,
  validation = [],
  write = true,
}) => {
  if (!file) {
    throw new Error("Please upload a file", { cause: { status: 400 } });
  }

  const result = await fileTypeFromBuffer(file.buffer);

  if (!result || !validation.includes(result.mime)) {
    throw new Error("Invalid file formats", { cause: { status: 400 } });
  }

  if (write) {
    const targetDir = resolve(`./assets/${customPath}`);
    await mkdir(targetDir, { recursive: true });

    const uniqueFilePath = `assets/${customPath}/${randomUUID()}.${result.ext}`;
    await writeFile(resolve(`./${uniqueFilePath}`), file.buffer);
    file.finalPath = uniqueFilePath;
  }

  return { file, result };
};

export const processFiles = async ({
  customPath = "general",
  files = [],
  validation = [],
}) => {
  if (!files || files.length === 0) {
    throw new Error("Please upload files", { cause: { status: 400 } });
  }

  for (const file of files) {
    await processFile({ customPath, file, validation, write: false });
  }

  const assets = [];
  for (const file of files) {
    const processed = await processFile({
      customPath,
      file,
      validation,
      write: true,
    });
    assets.push(processed.file);
  }

  return assets;
};

export const processField = async ({
  customPath = "general",
  fields = {},
  validation = [],
}) => {
  if (!fields || Object.keys(fields).length === 0) {
    throw new Error("Please upload fields", { cause: { status: 400 } });
  }

  let allFiles = [];
  for (const key in fields) {
    if (Array.isArray(fields[key])) {
      allFiles.push(...fields[key]);
    }
  }

  if (allFiles.length === 0) {
    throw new Error("Please upload files", { cause: { status: 400 } });
  }

  for (const file of allFiles) {
    await processFile({ customPath, file, validation, write: false });
  }

  const processedFields = {};
  for (const key in fields) {
    processedFields[key] = [];
    for (const file of fields[key]) {
      const processed = await processFile({
        customPath,
        file,
        validation,
        write: true,
      });
      processedFields[key].push(processed.file);
    }
  }

  return processedFields;
};

export const processMulterUpload = ({
  customPath = "general",
  validation = [],
}) => {
  return async (req, res, next) => {
    try {
      if (req.file) {
        await processFile({
          customPath,
          file: req.file,
          validation,
          write: true,
        });
      } else if (req.files) {
        if (Array.isArray(req.files)) {
          await processFiles({ customPath, files: req.files, validation });
        } else {
          await processField({ customPath, fields: req.files, validation });
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
