import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// ================= REGISTER =================
export async function register(req, res) {
  const { username, email, password, adminSecret } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }]
  });

  if (isAlreadyRegistered) {
    return res.status(409).json({ message: "Username or email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isAdmin = adminSecret && adminSecret === process.env.ADMIN_SECRET;

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
    role: isAdmin ? "admin" : "user"
  });

  const accessToken = signToken(user);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    accessToken
  });
}

// ================= LOGIN =================
export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.isBlocked) {
    return res.status(403).json({ message: "User is blocked" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const accessToken = signToken(user);

  return res.status(200).json({
    message: "Logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    accessToken
  });
}

// ================= GET ME =================
export async function getMe(req, res) {
  const user = req.user;
  return res.status(200).json({
    message: "User fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
}

 
