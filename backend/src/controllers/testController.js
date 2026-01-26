const TestSession = require("../models/TestSession");

exports.getProtectedData = (req, res) => {
  res.json({
    message: "You have access to protected data",
    userId: req.user.userId
  });
};
// console.log("Decoded JWT payload:", req.user);

exports.uploadVoiceTest = async (req, res) => {
  console.log("Decoded JWT payload:", req.user);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    const metadata = req.body.metadata
      ? JSON.parse(req.body.metadata)
      : {};

    if (!req.user || (!req.user.userId)) {
  return res.status(401).json({ message: "User not authenticated" });
}
      const session = new TestSession({
      userId: req.user.userId, // from authMiddleware
      voiceTest: {
        audioPath: req.file.path,
        prompt: metadata.prompt || "",
        recordedAt: metadata.timestamp
          ? new Date(metadata.timestamp)
          : new Date()
      }
    });

    await session.save();

    return res.status(201).json({
      success: true,
      testSessionId: session._id
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