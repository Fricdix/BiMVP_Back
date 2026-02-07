import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getAuthCookieExpress, verifySessionToken } from "../lib/auth-express";

const router = Router();

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["USER", "ANALYST", "ADMIN"]).optional(),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["USER", "ANALYST", "ADMIN"]).optional(),
});

async function requireAdmin(req: any, res: any) {
  const token = getAuthCookieExpress(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const session = await verifySessionToken(token);
    if (session.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    return session;
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

router.get("/", async (req, res) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return res.json({ users });
});

router.post("/", async (req, res) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Datos invalidos" });

  const exists = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (exists) return res.status(409).json({ message: "Email ya existe" });

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      role: parsed.data.role ?? "USER",
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return res.json({ user });
});

router.patch("/:id", async (req, res) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Datos invalidos" });

  const data: any = { ...parsed.data };

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return res.json({ user });
});

router.delete("/:id", async (req, res) => {
  const session = await requireAdmin(req, res);
  if (!session) return;

  await prisma.user.delete({ where: { id: req.params.id } });
  return res.json({ ok: true });
});

export default router;
