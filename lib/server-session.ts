import { getAuthCookie, verifySessionToken } from '@/lib/auth'

export async function getServerSession() {
  const token = getAuthCookie()
  if (!token) return null
  try {
    return await verifySessionToken(token)
  } catch {
    return null
  }
}
