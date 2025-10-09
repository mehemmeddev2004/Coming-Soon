import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://etor.onrender.com/api/products';
const COMMON_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'NextJS-Proxy/1.0',
};

/**
 * JSON parse üçün təhlükəsiz funksiya
 */
async function safeParseJSON(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('❌ JSON parse xətası:', error);
    throw new Error('Backend server xətası - JSON cavab gözlənilirdi');
  }
}

/**
 * 🔹 GET /api/products/:id
 * Məhsul məlumatlarını gətirir
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${BASE_URL}/${id}`, { headers: COMMON_HEADERS });

    console.log('📥 Backend cavab statusu:', response.status);
    const data = await safeParseJSON(response);

    // Məhsul tapılmadıqda fallback məhsul gətir
    if (!response.ok) {
      if (response.status === 404) {
        console.log('🔄 Məhsul tapılmadı, fallback gətirilir...');
        const fallbackResponse = await fetch(BASE_URL, { headers: COMMON_HEADERS });

        if (fallbackResponse.ok) {
          const fallbackData = await safeParseJSON(fallbackResponse);
          if (Array.isArray(fallbackData) && fallbackData.length > 0) {
            console.log('✅ Fallback məhsul qaytarıldı');
            return NextResponse.json(fallbackData[0], { status: 200 });
          }
        }
      }

      return NextResponse.json(
        {
          message: data.message || 'Məhsul tapılmadı',
          statusCode: response.status,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('💥 GET məhsul xətası:', error);
    return NextResponse.json(
      {
        message: 'Şəbəkə xətası - Məhsul məlumatları alına bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

/**
 * 🔹 PUT /api/products/:id
 * Məhsulu yeniləyir
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Auth header ötürülürsə əlavə et
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {
      ...COMMON_HEADERS,
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    };

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await safeParseJSON(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || 'Məhsul yenilənərkən xəta baş verdi',
          statusCode: response.status,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('💥 PUT məhsul xətası:', error);
    return NextResponse.json(
      {
        message: 'Şəbəkə xətası - Məhsul yenilənə bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

/**
 * 🔹 DELETE /api/products/:id
 * Məhsulu silir
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Auth header ötürülürsə əlavə et
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {
      ...COMMON_HEADERS,
      ...(authHeader ? { Authorization: authHeader } : {}),
    };

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers,
    });

    const data = await safeParseJSON(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || 'Məhsul silinərkən xəta baş verdi',
          statusCode: response.status,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('💥 DELETE məhsul xətası:', error);
    return NextResponse.json(
      {
        message: 'Şəbəkə xətası - Məhsul silinə bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
