import { cookies } from 'next/headers';
import api from '@/src/api/axios';

export async function getServerAuthUser() {
  const token = cookies().get('jwt')?.value;
  if (!token) return null;

  try {
    const res = await api.get('/auth/me', {
      headers: { Cookie: `jwt=${token}` },
    });
    // @ts-ignore - axios returns data directly because of our interceptor or standard usage
    // Actually, in our src/api/axios.ts we didn't add the unwrap interceptor yet.
    // I should add it to matchApiClient or just handle it here.
    return res.data?.data?.user ?? res.data?.user ?? null;
  } catch (error) {
    return null;
  }
}
