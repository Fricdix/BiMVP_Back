import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Mount auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

app.get("/", (req, res) =>
  res.send(
    "BI backend - Routes: POST /api/auth/login, POST /api/auth/register, POST /api/auth/logout, GET /api/auth/me",
  ),
);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on port ${port}`));
