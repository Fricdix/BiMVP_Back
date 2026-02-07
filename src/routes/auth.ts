import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import {
  signSessionToken,
  setAuthCookieExpress,
  clearAuthCookieExpress,
  getAuthCookieExpress,
  verifySessionToken,
} from "../lib/auth-express";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Datos inválidos" });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(401).json({ message: "Credenciales incorrectas" });

  // Comparar contraseña en texto plano (solo desarrollo)
  const ok = password === user.password;
  if (!ok) return res.status(401).json({ message: "Credenciales incorrectas" });

  const token = await signSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  setAuthCookieExpress(res, token);
  return res.json({
    ok: true,
    session: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Datos inválidos" });

  const { name, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: "Usuario ya existe" });

  const user = await prisma.user.create({
    data: { name, email, password },
  });

  const token = await signSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  setAuthCookieExpress(res, token);
  return res.json({
    ok: true,
    session: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

router.post("/logout", async (req, res) => {
  clearAuthCookieExpress(res);
  return res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  const token = getAuthCookieExpress(req);
  if (!token) return res.status(401).json({ message: "No auth" });
  try {
    const payload = await verifySessionToken(token);
    return res.json({ ok: true, session: payload });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
