const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const chatRoutes = require("./routes/chat");

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || "*";
const requests = new Map();

const apiRateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 300;

  const userRequests = requests.get(ip) || [];
  const recentRequests = userRequests.filter((timestamp) => now - timestamp < windowMs);

  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({ message: "Too many requests, please try again later." });
  }

  recentRequests.push(now);
  requests.set(ip, recentRequests);
  return next();
};

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-XSS-Protection", "0");
  next();
});

app.use(
  cors({
    origin: allowedOrigin,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use("/api", apiRateLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.json({ message: "NeuroScribe Plus API is running" });
});

app.use("/uploads", express.static("uploads"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 500 ? "Internal server error" : err.message;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ message });
});

module.exports = app;
