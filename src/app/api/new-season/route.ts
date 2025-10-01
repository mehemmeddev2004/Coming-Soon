import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://etor.onrender.com/api/new-season';

// GET /api/new-season - Bütün sezonlar
export async function GET(request: NextRequest) {
  console.log('🔥 API Route called: GET /api/new-season');
  
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${BACKEND_URL}?${queryString}` : BACKEND_URL;
    
    console.log('📤 Seasons URL:', fullUrl);
    
    const response = await fetch(fullUrl, {
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
      console.log('✅ Parsed seasons data:', data);
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
          message: data.message || 'Sezonlar yüklənərkən xəta baş verdi',
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
    console.error('💥 Seasons GET error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Backend serverə çatmaq mümkün olmadı',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
