import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/server-session";

export async function GET(req: Request) {
  const me = await getServerSession();
  if (!me)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform") || "ALL";

  const where: any = { country: "Ecuador" };
  if (platform !== "ALL") where.platform = platform;

  const items = await prisma.influencer.findMany({
    where,
    orderBy: [{ followers: "desc" }],
  });

  return NextResponse.json({ items });
}
