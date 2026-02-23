require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5050;

connectDB();

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
