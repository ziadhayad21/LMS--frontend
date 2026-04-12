import { cookies } from 'next/headers';
import api from '@/src/api/axios';

export async function getServerAuthUser() {
  const token = cookies().get('jwt')?.value;
  if (!token) return null;

  try {
    const res: any = await api.get('/auth/me', {
      headers: { Cookie: `jwt=${token}` },
    });
    return res.data?.user ?? null;
  } catch (error) {
    return null;
  }
}
