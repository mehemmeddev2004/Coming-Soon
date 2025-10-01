const BASE_URL = '';

export async function registerApi(
  email: string, 
  password: string,
  firstname: string,
  lastname: string,
  role: string = "admin"
) {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstname, lastname, role }),
    });

    if (!res.ok) {
      throw new Error(`Registration failed with status ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.log(err);
    return undefined;
  }
}
