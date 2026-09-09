import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

export async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await AdminUser.findById(payload.id).select("-passwordHash");
    if (!user || !user.isActive) return res.status(401).json({ message: "Not authenticated" });

    req.adminUser = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.adminUser || !roles.includes(req.adminUser.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
