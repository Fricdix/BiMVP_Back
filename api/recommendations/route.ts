import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/server-session";

export async function GET() {
  const me = await getServerSession();
  if (!me)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const items = await prisma.recommendation.findMany({
    orderBy: { matchScore: "desc" },
    include: { product: true, influencer: true },
    take: 20,
  });

  return NextResponse.json({ items });
}
