import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signSessionToken, setAuthCookie } from '@/lib/auth'

export const runtime = "nodejs"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 })
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 })
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 })
  }

  const token = await signSessionToken({ sub: user.id, email: user.email, name: user.name, role: user.role })
  setAuthCookie(token)

  return NextResponse.json({ ok: true })
}
