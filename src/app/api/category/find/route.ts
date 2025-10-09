import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://etor.onrender.com/api/category/find';

// GET /api/category/find - Kateqoriya axtarmaq
export async function GET(request: NextRequest) {
  console.log('🚀 API Route /api/category/find GET called');
  try {
    // Get search parameters from URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${BACKEND_URL}?${queryString}` : BACKEND_URL;

    console.log(`🔄 Fetching categories from backend: ${fullUrl}`);
    const startTime = Date.now();
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Proxy/1.0',
      },
    });
    const endTime = Date.now();
    console.log(`⚡ Categories backend responded in ${endTime - startTime}ms`);

    const responseText = await response.text();
    console.log(`📄 Categories backend response status: ${response.status}, content length: ${responseText.length}`);
    console.log(`📋 Categories backend response preview: ${responseText.substring(0, 500)}...`);
    
    let data;
    try {
      data = JSON.parse(responseText);
     
    } catch (parseError) {
      console.error('❌ Failed to parse categories JSON:', parseError);
      console.error('❌ Raw categories response text:', responseText.substring(0, 1000));
      
      return NextResponse.json(
        { 
          message: 'Backend server xətası - JSON cavab gözlənilirdi',
          details: 'Server HTML cavab göndərdi, JSON deyil',
          preview: responseText.substring(0, 200)
        },
        { status: 502 }
      );
    }
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          message: data.message || 'Kateqoriya axtarışında xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error('💥 Category search error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Axtarış aparıla bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
