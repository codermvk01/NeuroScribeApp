const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");
const testController = require("../controllers/testController");

const router = express.Router();

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const buildStorage = (folder, prefix, fallbackExt) =>
  multer.diskStorage({
    destination: function destination(req, file, cb) {
      const uploadDir = path.join("uploads", folder);
      ensureDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: function filename(req, file, cb) {
      const ext = path.extname(file.originalname) || fallbackExt;
      cb(null, `${prefix}-${Date.now()}${ext}`);
    },
  });

const createUploader = ({ storage, fileTypes, maxFileSize }) =>
  multer({
    storage,
    limits: { fileSize: maxFileSize },
    fileFilter: (req, file, cb) => {
      if (!fileTypes.includes(file.mimetype)) {
        return cb(new Error(`Invalid file type: ${file.mimetype}`));
      }

      return cb(null, true);
    },
  });

const uploadVoice = createUploader({
  storage: buildStorage("voice", "voice", ".m4a"),
  fileTypes: ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/webm"],
  maxFileSize: 10 * 1024 * 1024,
});

const uploadPicture = createUploader({
  storage: buildStorage("picture", "picture", ".jpg"),
  fileTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFileSize: 8 * 1024 * 1024,
});

const uploadVideo = createUploader({
  storage: buildStorage("video", "video", ".mp4"),
  fileTypes: ["video/mp4", "video/quicktime", "video/webm"],
  maxFileSize: 60 * 1024 * 1024,
});

router.get("/protected", authMiddleware, testController.getProtectedData);

router.post("/tests/voice/upload", authMiddleware, uploadVoice.single("file"), testController.uploadVoiceTest);
router.post("/tests/picture/upload", authMiddleware, uploadPicture.single("file"), testController.uploadPictureTest);
router.post("/tests/video/upload", authMiddleware, uploadVideo.single("file"), testController.uploadVideoTest);

module.exports = router;
