// src/utils/api.ts
export const BASE_URL = '/api/auth';

export async function loginApi(email: string, password: string) {
  try {
    const url = `${BASE_URL}/login`; // /login endpoint
    console.log('Login URL:', url);
    console.log('Login data:', { email, password });

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.log('Error response:', errorData);
      
      // Handle specific error messages
      if (res.status === 401) {
        throw new Error('Email və ya şifrə yanlışdır');
      } else if (res.status === 500) {
        throw new Error(errorData.message || 'Server xətası baş verdi');
      } else {
        throw new Error(errorData.message || `Giriş uğursuz oldu (Status: ${res.status})`);
      }
    }

    const data = await res.json();
    console.log('Success response:', data);
    return data;
  } catch (err) {
    console.log('Login API error:', err);
    throw err;
  }
}
