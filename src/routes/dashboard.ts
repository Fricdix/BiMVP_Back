import { Router } from "express";
import { prisma } from "../lib/prisma";
import { getAuthCookieExpress, verifySessionToken } from "../lib/auth-express";

const router = Router();

async function requireSession(req: any, res: any) {
  const token = getAuthCookieExpress(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    return await verifySessionToken(token);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

router.get("/summary", async (req, res) => {
  const session = await requireSession(req, res);
  if (!session) return;

  const latest = await prisma.kpiDaily.findFirst({
    orderBy: { date: "desc" },
  });
  const prev = latest
    ? await prisma.kpiDaily.findFirst({
        where: { date: { lt: latest.date } },
        orderBy: { date: "desc" },
      })
    : null;

  const byCategory = await prisma.report.groupBy({
    by: ["category"],
    _count: { category: true },
  });

  return res.json({
    kpi: latest,
    prev,
    categories: byCategory.map((c) => ({
      name: c.category,
      value: c._count.category,
    })),
  });
});

router.get("/timeseries", async (req, res) => {
  const session = await requireSession(req, res);
  if (!session) return;

  const points = await prisma.kpiDaily.findMany({
    orderBy: { date: "asc" },
  });

  return res.json({ points });
});

export default router;
