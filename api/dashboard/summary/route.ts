import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/server-session'

export const runtime = "nodejs"

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const latest = await prisma.kpiDaily.findFirst({ orderBy: { date: 'desc' } })
  const prev = latest
    ? await prisma.kpiDaily.findFirst({ where: { date: { lt: latest.date } }, orderBy: { date: 'desc' } })
    : null

  const byCategory = await prisma.report.groupBy({
    by: ['category'],
    _count: { category: true }
  })

  return NextResponse.json({
    kpi: latest,
    prev,
    categories: byCategory.map((c) => ({ name: c.category, value: c._count.category }))
  })
}
