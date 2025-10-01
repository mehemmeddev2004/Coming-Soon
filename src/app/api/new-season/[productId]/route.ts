import { NextRequest, NextResponse } from 'next/server';

// POST /api/new-season/:productId - Yeni sezon yaratmaq
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  console.log('🔥 API Route called: POST /api/new-season/:productId');
  
  try {
    const { productId } = await params;
    const body = await request.json();
    console.log('📤 Product ID:', productId);
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
    
    const response = await fetch(`https://etor.onrender.com/api/new-season/${productId}`, {
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
      console.log('✅ Season created:', data);
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
          message: data.message || 'Sezon yaradılarkən xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('💥 Season POST error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Sezon yaradıla bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

// PUT /api/new-season/:id - Sezon yeniləmək
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  console.log('🔥 API Route called: PUT /api/new-season/:id');
  
  try {
    const { productId: id } = await params; // Using as season ID for update
    const body = await request.json();
    console.log('📤 Season ID:', id);
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
    
    const response = await fetch(`https://etor.onrender.com/api/new-season/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    console.log('📥 Backend response status:', response.status);
    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Season updated:', data);
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
          message: data.message || 'Sezon yenilənərkən xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('💥 Season update error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Sezon yenilənə bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

// DELETE /api/new-season/:id - Sezon silmək
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  console.log('🔥 API Route called: DELETE /api/new-season/:id');
  
  try {
    const { productId: id } = await params; // Using as season ID for delete
    console.log('📤 Deleting season ID:', id);
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'NextJS-Proxy/1.0',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`https://etor.onrender.com/api/new-season/${id}`, {
      method: 'DELETE',
      headers,
    });

    console.log('📥 Backend response status:', response.status);
    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Season deleted:', data);
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
          message: data.message || 'Sezon silinərkən xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('💥 Season delete error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Sezon silinə bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
