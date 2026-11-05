import multer from "multer";
import path from "node:path";

const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.has(ext)) return cb(new Error("Unsupported image type"));
    cb(null, true);
  },
});
