const TestSession = require("../models/TestSession");

const parseMetadata = (rawMetadata) => {
  if (!rawMetadata) {
    return {};
  }

  try {
    return JSON.parse(rawMetadata);
  } catch (error) {
    return null;
  }
};

const requireAuthenticatedUser = (req, res) => {
  if (!req.user || !req.user.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return false;
  }

  return true;
};

exports.getProtectedData = (req, res) => {
  res.json({
    message: "You have access to protected data",
    userId: req.user.userId,
  });
};

exports.uploadVoiceTest = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    if (!requireAuthenticatedUser(req, res)) {
      return;
    }

    const metadata = parseMetadata(req.body.metadata);
    if (metadata === null) {
      return res.status(400).json({ message: "Invalid metadata payload" });
    }

    const session = new TestSession({
      userId: req.user.userId,
      voiceTest: {
        audioPath: req.file.path,
        prompt: metadata.prompt || "",
        recordedAt: metadata.timestamp ? new Date(metadata.timestamp) : new Date(),
      },
    });

    await session.save();

    return res.status(201).json({
      success: true,
      testSessionId: session._id,
    });
  } catch (error) {
    console.error("Voice upload error:", error);
    return res.status(500).json({ message: "Voice upload failed" });
  }
};

exports.uploadPictureTest = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    if (!requireAuthenticatedUser(req, res)) {
      return;
    }

    const metadata = parseMetadata(req.body.metadata);
    if (metadata === null) {
      return res.status(400).json({ message: "Invalid metadata payload" });
    }

    const session = new TestSession({
      userId: req.user.userId,
      pictureTest: {
        imagePath: req.file.path,
        prompt: metadata.prompt || "",
        recordedAt: metadata.timestamp ? new Date(metadata.timestamp) : new Date(),
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

    if (!requireAuthenticatedUser(req, res)) {
      return;
    }

    const metadata = parseMetadata(req.body.metadata);
    if (metadata === null) {
      return res.status(400).json({ message: "Invalid metadata payload" });
    }

    const session = new TestSession({
      userId: req.user.userId,
      videoTest: {
        videoPath: req.file.path,
        prompt: metadata.prompt || "",
        recordedAt: metadata.timestamp ? new Date(metadata.timestamp) : new Date(),
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
