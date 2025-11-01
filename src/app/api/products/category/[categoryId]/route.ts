import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://etor.onrender.com/api/products';

// POST /api/products/category/:categoryId - Məhsul yaratmaq
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  console.log('🔥 API Route called: POST /api/products/category/:categoryId');
  
  try {
    const { categoryId } = await params;
    const body = await request.json();
    console.log('📤 Category ID:', categoryId);
    console.log('📤 Request body:', body);
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'NextJS-Proxy/1.0',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Ensure backend-required shape: description must be an array
    const descriptionArray = Array.isArray(body?.description)
      ? body.description
      : body?.description
      ? [String(body.description).trim()]
      : []

    const normalizedBody = {
      ...body,
      description: descriptionArray,
    }

    const response = await fetch(`${BACKEND_URL}/category/${categoryId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(normalizedBody),
    });

    console.log('📥 Backend response status:', response.status);
    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText.substring(0, 200));
    
    let data;
    try {
      data = JSON.parse(responseText);
      if (response.ok) {
        console.log('✅ Product created:', data);
      } else {
        console.log('❌ Backend returned error JSON:', data);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      return NextResponse.json(
        { 
          message: 'Backend server xətası - JSON cavab gözlənilirdi',
          details: 'Server HTML cavab göndərdi, JSON deyil'
        },
        { status: 502 }
      );
    }
    
    if (!response.ok) {
      console.log('❌ Backend error:', data);
      return NextResponse.json(
        { 
          message: data.message || 'Məhsul yaradılarkən xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('💥 Product creation error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Məhsul yaradıla bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
