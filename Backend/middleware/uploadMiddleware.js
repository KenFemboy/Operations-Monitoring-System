import multer from "multer";

const storage = multer.memoryStorage();
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const createImageUpload = (fileSize) =>
  multer({
    storage,
    limits: {
      fileSize,
      files: 1,
    },
    fileFilter: (_req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Only JPG, PNG, and WEBP images are allowed");
        error.statusCode = 400;
        return cb(error);
      }

      cb(null, true);
    },
  });

export const uploadImage = createImageUpload(5 * 1024 * 1024);

export const uploadFeedbackImage = createImageUpload(50 * 1024 * 1024);

export const uploadEmployeeImage = uploadImage;
