import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch("https://etor.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    const responseText = await response.text()

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      return NextResponse.json(
        {
          message: "Server JSON formatında cavab göndərmədi",
          rawResponse: responseText.substring(0, 200),
        },
        { status: 502 }
      )
    }

    // Backend errorları üçün sadə idarəetmə
    if (!response.ok) {
      let message = data.message || "Bilinməyən xəta"

      if (response.status === 401) message = "Email və ya şifrə yanlışdır"
      if (response.status === 500)
        message = "Serverdə problem baş verdi, sonradan cəhd edin"

      return NextResponse.json(
        { message, statusCode: response.status },
        { status: response.status }
      )
    }

    // Uğurlu cavab
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Şəbəkə xətası - serverə qoşulmaq mümkün olmadı",
        error: error instanceof Error ? error.message : "Naməlum xəta",
      },
      { status: 503 }
    )
  }
}
