const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

app.get("/", (req, res) => {
  res.json({ message: "NeuroScribe Plus API is running" });
});

app.use("/uploads", express.static("uploads"));
app.use("/api", require("./routes/testRoutes"));

module.exports = app;
