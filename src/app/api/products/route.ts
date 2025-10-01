import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://etor.onrender.com/api/products';

// GET /api/products - Bütün məhsullar
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${BACKEND_URL}?${queryString}` : BACKEND_URL;
    
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Proxy/1.0',
      },
    });

    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
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
      return NextResponse.json(
        { 
          message: data.message || 'Məhsullar yüklənərkən xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    // Ensure we always return an array
    if (Array.isArray(data)) {
      return NextResponse.json(data, { status: 200 });
    } else if (data && typeof data === 'object') {
      return NextResponse.json([data], { status: 200 });
    } else {
      return NextResponse.json([], { status: 200 });
    }
    
  } catch (error) {
    console.error('💥 Products GET error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Backend serverə çatmaq mümkün olmadı',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

// POST /api/products - Məhsul yaratmaq
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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
    
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      return NextResponse.json(
        { 
          message: 'Backend server xətası - JSON cavab gözlənilirdi'
        },
        { status: 502 }
      );
    }
    
    if (!response.ok) {
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
    console.error('💥 Product POST error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Məhsul yaradıla bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
