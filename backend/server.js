require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const validateEnv = require("./src/config/env");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    validateEnv();
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server bootstrap failed:", error.message);
    process.exit(1);
  }
}

startServer();
