export async function registerApi(
  email: string, 
  password: string,
  firstname: string,
  lastname: string
) {
  const res = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstname, lastname }),
  });

  if (!res.ok) {
    throw new Error('Registration failed');
  }

  return res.json();
}