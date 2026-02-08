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

router.get("/", async (req, res) => {
  const session = await requireSession(req, res);
  if (!session) return;

  const platform = (req.query.platform as string) || "ALL";

  const where: any = { country: "Ecuador" };
  if (platform !== "ALL") where.platform = platform;

  const items = await prisma.influencer.findMany({
    where,
    orderBy: [{ followers: "desc" }],
  });

  return res.json({ items });
});

export default router;
