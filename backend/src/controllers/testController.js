const axios = require("axios");
const FormData = require("form-data");
const TestSession = require("../models/TestSession");

exports.getProtectedData = (req, res) => {
  res.json({
    message: "You have access to protected data",
    userId: req.user.userId
  });
};
// console.log("Decoded JWT payload:", req.user);

exports.uploadVoiceTest = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const metadata = req.body.metadata
      ? JSON.parse(req.body.metadata)
      : {};

    const formData = new FormData();

    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    formData.append("user_id", req.user.userId);
    formData.append("test_id", "voice_test");

    const fastapiResponse = await axios.post(
      `${process.env.FASTAPI_BASE_URL}/analyze/voice`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const { prediction, confidence } = fastapiResponse.data;

    const session = new TestSession({
      userId: req.user.userId,
      voiceTest: {
        prediction,
        confidence,
        prompt: metadata.prompt || "",
        recordedAt: metadata.timestamp
          ? new Date(metadata.timestamp)
          : new Date(),
      },
    });

    await session.save();

    return res.status(201).json({
      success: true,
      prediction,
      confidence,
      testSessionId: session._id,
    });

  } catch (error) {
    console.error("FastAPI forwarding error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Voice ML processing failed",
    });
  }
};

exports.uploadPictureTest = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const metadata = req.body.metadata
      ? JSON.parse(req.body.metadata)
      : {};

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const session = new TestSession({
      userId: req.user.userId,
      pictureTest: {
        imagePath: req.file.path,
        prompt: metadata.prompt || "",
        recordedAt: metadata.timestamp
          ? new Date(metadata.timestamp)
          : new Date(),
      },
    });

    await session.save();

    return res.status(201).json({
      success: true,
      testSessionId: session._id,
    });
  } catch (error) {
    console.error("Picture upload error:", error);
    return res.status(500).json({ message: "Picture upload failed" });
  }
};
exports.uploadVideoTest = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const metadata = req.body.metadata
      ? JSON.parse(req.body.metadata)
      : {};

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const session = new TestSession({
      userId: req.user.userId,
      videoTest: {
        videoPath: req.file.path,
        prompt: metadata.prompt || "",
        recordedAt: metadata.timestamp
          ? new Date(metadata.timestamp)
          : new Date(),
      },
    });

    await session.save();

    return res.status(201).json({
      success: true,
      testSessionId: session._id,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return res.status(500).json({ message: "Video upload failed" });
  }
};