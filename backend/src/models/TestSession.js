const mongoose = require("mongoose");

const testSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    drawingScore: {
      type: Number,
      default: 0
    },
    voiceScore: {
      type: Number,
      default: 0
    },
    videoScore: {
      type: Number,
      default: 0
    },
    finalRiskScore: {
      type: Number,
      default: 0
    },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low"
    },
    voiceTest: {
  audioPath: {
    type: String
  },
  prompt: {
    type: String
  },
  recordedAt: {
    type: Date
  }
},
pictureTest: {
  imagePath: {
    type: String
  },
  prompt: {
    type: String
  },
  recordedAt: {
    type: Date
  }
},
videoTest: {
  videoPath: {
    type: String
  },
  prompt: {
    type: String
  },
  recordedAt: {
    type: Date
  }
},

  },
  {
    timestamps: true
  },
  
  
);

module.exports = mongoose.model("TestSession", testSessionSchema);
