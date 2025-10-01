import { NextRequest, NextResponse } from 'next/server';

// POST /api/products/:id/variants - Məhsula variant əlavə etmək
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🔥 API Route called: POST /api/products/:id/variants');
  
  try {
    const { id } = await params;
    const body = await request.json();
    console.log('📤 Product ID:', id);
    console.log('📤 Variant data:', body);
    
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
    
    const response = await fetch(`https://etor.onrender.com/api/products/${id}/variants`, {
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
      console.log('✅ Variant created:', data);
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
          message: data.message || 'Variant əlavə edilərkən xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('💥 Variant creation error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Variant əlavə edilə bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
