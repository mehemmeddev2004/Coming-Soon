import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://etor.onrender.com/api/category';

// GET /api/category - Bütün kateqoriyalar
export async function GET(request: NextRequest) {

  
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Proxy/1.0',
      },
    });

    console.log('📥 Backend response status:', response.status);
    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText.substring(0, 200));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
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
          message: data.message || 'Kateqoriyalar yüklənərkən xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error('💥 Categories GET error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Backend serverə çatmaq mümkün olmadı',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

// POST /api/category - Kateqoriya yaratmaq
export async function POST(request: NextRequest) {
  console.log('🔥 API Route called: POST /api/category');
  
  try {
    const body = await request.json();
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
    
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    console.log('📥 Backend response status:', response.status);
    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Category created:', data);
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
      console.log('❌ Backend error:', data);
      return NextResponse.json(
        { 
          message: data.message || 'Kateqoriya yaradılarkən xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('💥 Category POST error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Kateqoriya yaradıla bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
