import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/server-session'

export const runtime = "nodejs"

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const points = await prisma.kpiDaily.findMany({
    orderBy: { date: 'asc' }
  })

  return NextResponse.json({ points })
}
