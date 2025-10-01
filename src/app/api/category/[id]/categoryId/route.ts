import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://etor.onrender.com/api/category';

// 🔹 POST: Kateqoriya yeniləmək
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = request.headers.get('authorization');
    if (token) headers['Authorization'] = token;

    const res = await fetch(`${BASE_URL}/${id}/categoryId`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const text = await res.text();
    const data = safeParse(text);

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || 'Kateqoriya yenilənərkən xəta baş verdi' },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Şəbəkə xətası - Kateqoriya yenilənə bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

// 🔹 DELETE: Kateqoriya silmək
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    const token = request.headers.get('authorization');
    if (token) headers['Authorization'] = token;

    const res = await fetch(`${BASE_URL}/${id}/categoryId`, {
      method: 'DELETE',
      headers,
    });

    const text = await res.text();
    const data = safeParse(text);

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || 'Kateqoriya silinərkən xəta baş verdi' },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Şəbəkə xətası - Kateqoriya silinə bilmədi',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

// ✅ JSON parse helper
function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: 'Backend JSON cavabı göndərmədi' };
  }
}
