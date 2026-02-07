import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signSessionToken, setAuthCookie } from '@/lib/auth'

export const runtime = "nodejs"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 })
  }

  const { name, email, password } = parsed.data
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json({ message: 'Ese email ya está registrado' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'USER' }
  })

  const token = await signSessionToken({ sub: user.id, email: user.email, name: user.name, role: user.role })
  setAuthCookie(token)

  return NextResponse.json({ ok: true })
}
