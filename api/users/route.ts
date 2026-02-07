import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/server-session'

export const runtime = "nodejs"

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['USER','ANALYST','ADMIN'])
})

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })
  return NextResponse.json({ users })
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 })

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (exists) return NextResponse.json({ message: 'Email ya existe' }, { status: 409 })

  const passwordHash = await bcrypt.hash(parsed.data.password, 10)
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })

  return NextResponse.json({ user })
}
