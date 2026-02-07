import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/server-session'

export const runtime = "nodejs"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const category = searchParams.get('category')

  const where: any = {}
  if (category && category !== 'all') where.category = category
  if (from || to) {
    where.createdAt = {}
    if (from) where.createdAt.gte = new Date(from)
    if (to) where.createdAt.lte = new Date(to)
  }

  const reports = await prisma.report.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { metrics: true, createdBy: { select: { name: true, email: true } } }
  })

  const categories = await prisma.report.findMany({
    distinct: ['category'],
    select: { category: true },
    orderBy: { category: 'asc' }
  })

  return NextResponse.json({ reports, categories: categories.map((c) => c.category) })
}
