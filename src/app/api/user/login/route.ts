import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('API Route called: /api/user/login');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const response = await fetch('https://etor.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response data:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
