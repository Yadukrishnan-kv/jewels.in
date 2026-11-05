import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

function serialize(user) {
  return { id: user._id, name: user.name, email: user.email, phone: user.phone };
}

export async function register(req, res) {
  const { name, email, password, phone } = req.body;
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ message: "An account with this email already exists" });

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, phone: phone?.trim() || "", passwordHash });

  const token = signToken(user);
  res.status(201).json({ token, user: serialize(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !user.isActive) return res.status(401).json({ message: "Invalid email or password" });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });

  const token = signToken(user);
  res.json({ token, user: serialize(user) });
}

export async function me(req, res) {
  res.json(serialize(req.user));
}
