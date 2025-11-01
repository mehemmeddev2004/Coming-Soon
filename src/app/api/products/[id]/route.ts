import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/:id - Məhsul məlumatları
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  
  try {
    const { id } = await params;
    
    console.log(`🔍 Requesting product with ID: ${id} from backend`);
    
    const response = await fetch(`https://etor.onrender.com/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Proxy/1.0',
      },
    });

    console.log(`📥 Backend response status for ID ${id}:`, response.status);
    
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
      console.log('❌ Backend error:', data);
      console.log(`❌ Product with ID ${id} not found on backend`);
      
      // If product not found (404), return a more user-friendly message
      if (response.status === 404) {
        return NextResponse.json(
          { 
            message: 'Məhsul tapılmadı',
            statusCode: 404,
            details: `ID ${id} ilə məhsul mövcud deyil. Zəhmət olmasa əsas səhifəyə qayıdın.`
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { 
          message: data.message || 'Məhsul tapılmadı',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error('💥 Product GET error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Məhsul məlumatları alına bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

// PUT /api/products/:id - Məhsul yeniləmək
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  
  try {
    const { id } = await params;
    const body = await request.json();

    console.log('📤 PUT request body:', body);
    
    // Normalize description to array format (backend requirement)
    let descriptionArray: string[] = []
    
    if (Array.isArray(body?.description)) {
      // If already array, filter items with at least 3 chars
      descriptionArray = body.description.filter((item: any) => 
        typeof item === 'string' && item.trim().length >= 3
      )
    } else if (body?.description) {
      // If string, convert to array if >= 3 chars
      const desc = String(body.description).trim()
      if (desc.length >= 3) {
        descriptionArray = [desc]
      }
    }
    
    // Ensure at least one valid description
    if (descriptionArray.length === 0) {
      descriptionArray = ['Məhsul təsviri']
    }

    console.log('🔍 Final description array:', descriptionArray)
    console.log('🔍 Description array items:')
    descriptionArray.forEach((item, idx) => {
      console.log(`  [${idx}]: "${item}" (length: ${item.length})`)
    })

    const normalizedBody = {
      ...body,
      description: descriptionArray,
    }

    console.log('📦 Normalized body:', normalizedBody)
    console.log('📦 Normalized body description:', normalizedBody.description);
    
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
    
    const response = await fetch(`https://etor.onrender.com/api/products/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(normalizedBody),
    });


    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
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
          message: data.message || 'Məhsul yenilənərkən xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {

    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Məhsul yenilənə bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

// DELETE /api/products/:id - Məhsul silmək
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  
  try {
    const { id } = await params;
 
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'NextJS-Proxy/1.0',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`https://etor.onrender.com/api/products/${id}`, {
      method: 'DELETE',
      headers,
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
      console.log('❌ Backend error:', data);
      return NextResponse.json(
        { 
          message: data.message || 'Məhsul silinərkən xəta baş verdi',
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('💥 Product delete error:', error);
    return NextResponse.json(
      { 
        message: 'Şəbəkə xətası - Məhsul silinə bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
