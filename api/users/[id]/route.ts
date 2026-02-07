import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/server-session'

export const runtime = "nodejs"

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['USER','ANALYST','ADMIN']).optional()
})

export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 })

  const data: any = { ...parsed.data }
  if (data.password) {
    data.passwordHash = await bcrypt.hash(data.password, 10)
    delete data.password
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })

  return NextResponse.json({ user })
}

export async function DELETE(_req: Request, { params }: { params: { id: string }}) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
