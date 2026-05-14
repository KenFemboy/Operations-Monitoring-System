import multer from "multer";

const storage = multer.memoryStorage();
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
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
