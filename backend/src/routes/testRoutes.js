const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const testController = require("../controllers/testController");
const multer = require("multer");
const path = require("path");

router.get("/protected", authMiddleware, testController.getProtectedData);

module.exports = router;

/* =========================
   Multer config (voice)
========================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/voice");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `voice-${Date.now()}${ext || ".m4a"}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/* =========================
   Voice Test Upload Route
========================= */

router.post(
  "/tests/voice/upload",
  authMiddleware,
  upload.single("file"),
  testController.uploadVoiceTest
);

module.exports = router;

/* =========================
   Multer config (picture)
========================= */

const pictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/picture");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const filename = `picture-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const uploadPicture = multer({ storage: pictureStorage });

/* =========================
   Picture Test Upload Route
========================= */

router.post(
  "/tests/picture/upload",
  authMiddleware,
  uploadPicture.single("file"),
  testController.uploadPictureTest
);

/* =========================
   Multer config (video)
========================= */

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/video");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".mp4";
    const filename = `video-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const uploadVideo = multer({ storage: videoStorage });

/* =========================
   Video Test Upload Route
========================= */

router.post(
  "/tests/video/upload",
  authMiddleware,
  uploadVideo.single("file"),
  testController.uploadVideoTest
);