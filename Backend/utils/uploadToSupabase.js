import { v4 as uuidv4 } from "uuid";
import { getSupabase } from "../config/supabaseClient.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const extensionByMimeType = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const normalizeFolder = (folder = "") =>
  folder.toString().trim().replace(/^\/+|\/+$/g, "");

const sanitizeFilenamePart = (value = "") =>
  value
    .toString()
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const sanitizeFilenameBase = (value = "") =>
  value
    .toString()
    .trim()
    .replace(/\.[^.]+$/, "")
    .split("_")
    .map(sanitizeFilenamePart)
    .filter(Boolean)
    .join("_");

const createUploadError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateSupabaseConfig = () => {
  if (
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.SUPABASE_BUCKET
  ) {
    throw createUploadError("Image upload failed");
  }
};

export const uploadToSupabase = async (file, folder, options = {}) => {
  if (!file) {
    return null;
  }

  if (!allowedMimeTypes.has(file.mimetype)) {
    throw createUploadError("Only JPG, PNG, and WEBP images are allowed", 400);
  }

  validateSupabaseConfig();

  const safeFolder = normalizeFolder(folder);
  const extension = options.extension || extensionByMimeType[file.mimetype];
  const filenameBase = sanitizeFilenameBase(options.filenameBase);
  const filename = `${filenameBase || uuidv4()}.${extension}`;
  const filePath = safeFolder ? `${safeFolder}/${filename}` : filename;
  const supabase = getSupabase();

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: options.upsert || false,
    });

  if (error) {
    console.error("Supabase image upload failed:", {
      bucket: process.env.SUPABASE_BUCKET,
      path: filePath,
      statusCode: error.statusCode,
      error: error.error,
      message: error.message,
    });

    throw createUploadError("Image upload failed");
  }

  const { data } = supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
};

export default uploadToSupabase;
