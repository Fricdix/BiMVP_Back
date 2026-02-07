import { getServerSession } from "@/lib/server-session";

export async function getMe() {
  return await getServerSession();
}
