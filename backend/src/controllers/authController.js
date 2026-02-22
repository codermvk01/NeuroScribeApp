const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, aadhaar, phone, age, locality } = req.body;

    if (!name || !email || !password || !aadhaar || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { aadhaar }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      aadhaar: String(aadhaar).trim(),
      phone: String(phone).trim(),
      age,
      locality: locality ? String(locality).trim() : undefined,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup failed:", error);
    return res.status(500).json({ message: "Signup failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};
