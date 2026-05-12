import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import sharp from "sharp";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 5 * 1024 * 1024;

const getUploadRoot = () => process.env.UPLOAD_ROOT || "uploads";

const getUploadDir = (folder) => {
  const uploadRoot = getUploadRoot();
  return path.isAbsolute(uploadRoot)
    ? path.join(uploadRoot, folder)
    : path.resolve(process.cwd(), uploadRoot, folder);
};

const createMulter = (fieldName) =>
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxFileSize,
      files: 1,
    },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimeTypes.has(file.mimetype)) {
        const error = new Error("Only JPEG, PNG, and WebP images are allowed");
        error.statusCode = 400;
        return cb(error);
      }

      return cb(null, true);
    },
  }).single(fieldName);

const filenameFor = (prefix) =>
  `${prefix}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}.webp`;

const sanitizeFilenamePart = (value = "") =>
  value
    .toString()
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const getUploadedDateStamp = () => new Date().toISOString().slice(0, 10);

const handleUploadError = (error, res, next) => {
  if (!error) {
    next();
    return;
  }

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5MB or smaller"
        : error.message;

    res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
      success: false,
      message,
    });
    return;
  }

  res.status(error.statusCode || 400).json({
    success: false,
    message: error.message || "Invalid image upload",
  });
};

const makeImageUploadMiddleware = ({
  fieldName,
  folder,
  filenamePrefix,
  publicFolder,
  resize,
}) => {
  const multerUpload = createMulter(fieldName);

  return (req, res, next) => {
    multerUpload(req, res, async (uploadError) => {
      if (uploadError) {
        handleUploadError(uploadError, res, next);
        return;
      }

      if (!req.file) {
        next();
        return;
      }

      try {
        const uploadDir = getUploadDir(folder);
        await fs.mkdir(uploadDir, { recursive: true });

        const filename = filenameFor(filenamePrefix);
        const outputPath = path.join(uploadDir, filename);

        await sharp(req.file.buffer)
          .rotate()
          .resize(resize)
          .webp({ quality: 82 })
          .toFile(outputPath);

        req.uploadedImage = {
          publicPath: `/uploads/${publicFolder}/${filename}`,
        };

        next();
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "Failed to process uploaded image",
          error: error.message,
        });
      }
    });
  };
};

export const uploadEmployeePhoto = (req, res, next) => {
  createMulter("photo")(req, res, (uploadError) => {
    handleUploadError(uploadError, res, next);
  });
};

export const processUploadedEmployeePhoto = async (req, employeeId) => {
  if (!req.file) {
    return "";
  }

  const uploadDir = getUploadDir("employees");
  await fs.mkdir(uploadDir, { recursive: true });

  const safeEmployeeId = sanitizeFilenamePart(employeeId) || "employee";
  const dateUploaded = getUploadedDateStamp();
  const filename = filenameFor(`${safeEmployeeId}-${dateUploaded}`);
  const outputPath = path.join(uploadDir, filename);

  await sharp(req.file.buffer)
    .rotate()
    .resize({
      width: 720,
      height: 720,
      fit: "cover",
      position: "center",
    })
    .webp({ quality: 82 })
    .toFile(outputPath);

  req.uploadedImage = {
    publicPath: `/uploads/employees/${filename}`,
  };

  return req.uploadedImage.publicPath;
};

export const uploadFeedbackPhoto = makeImageUploadMiddleware({
  fieldName: "concernPhoto",
  folder: "feedback",
  filenamePrefix: "feedback",
  publicFolder: "feedback",
  resize: {
    width: 1280,
    height: 1280,
    fit: "inside",
    withoutEnlargement: true,
  },
});
