const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const testController = require("../controllers/testController");

router.get("/protected", authMiddleware, testController.getProtectedData);

module.exports = router;
