
export async function loginApi(email: string, password: string) {
  try {
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error(`Login failed with status ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.log(err);
    return undefined;
  }
}
