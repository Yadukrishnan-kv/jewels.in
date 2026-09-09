import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { connectDB } from "./config/db.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { runSeedIfEmpty } from "./seed/seed.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "*" }));
app.use(express.json({ limit: "5mb" }));

app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  await runSeedIfEmpty();
  app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
})();
