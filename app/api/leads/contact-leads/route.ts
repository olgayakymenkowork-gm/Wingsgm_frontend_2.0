import { NextResponse } from 'next/server';

// Берём URL и токен ТАК ЖЕ, как в /api/leads
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL;
const STRAPI_TOKEN =
  process.env.STRAPI_TOKEN || process.env.STRAPI_API_TOKEN;

export async function POST(req: Request) {
  // Логируем, что именно видит сервер
  console.log('[contact-leads] STRAPI_URL =', STRAPI_URL);
  console.log('[contact-leads] STRAPI_TOKEN exists =', !!STRAPI_TOKEN);

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error('Strapi env vars are missing');
    return NextResponse.json(
      { error: 'Server config error (Strapi env vars missing)' },
      { status: 500 },
    );
  }

  const body = await req.json();

  try {
    const res = await fetch(`${STRAPI_URL}/api/contact-leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data: body }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Strapi Contact Lead error:', res.status, text);
      return NextResponse.json(
        { error: 'Failed to create contact lead in Strapi' },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (err) {
    console.error('Contact Lead POST error:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 },
    );
  }
}
