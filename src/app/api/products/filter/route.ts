import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://etor.onrender.com/api/products/filter';

// GET /api/products/filter - Məhsul filtri
export async function GET(request: NextRequest) {
  console.log('🔥 API Route called: GET /api/products/filter');
  
  try {
    // Get filter parameters from URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${BACKEND_URL}?${queryString}` : BACKEND_URL;
    
    console.log('📤 Filter URL:', fullUrl);
    console.log('📤 Filter params:', Object.fromEntries(searchParams.entries()));
    
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
      console.log('✅ Filter results:', data);
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
          message: data.message || 'Məhsul filtrində xəta baş verdi',
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
    console.error('💥 Product filter error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Filtrlə axtarış aparıla bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
