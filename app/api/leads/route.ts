import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      machineId, // тут documentId (строка)
      contactName,
      companyName,
      country,
      phone,
      email,
      message,
    } = body;

    if (!machineId || !contactName || !email) {
      return NextResponse.json(
        { error: "machineId, contactName и email обязательны" },
        { status: 400 }
      );
    }

    const strapiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/leads`;

    const payload = {
      contact_name: contactName,
      company_name: companyName || "",
      country: country || "",
      phone: phone || "",
      email,
      message: message || "",
      // 👇 по доке Strapi 5 для many-to-one можно так:
      // { data: { machine: 'documentId' } }
      machine: machineId,
    };

    console.log("DATA SENT TO STRAPI:", payload);

    const strapiRes = await fetch(strapiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({ data: payload }),
    });

    const strapiText = await strapiRes.text();
    console.log("STRAPI LEAD RESPONSE:", strapiRes.status, strapiText);

    if (!strapiRes.ok) {
      let errMsg = "Strapi validation error";
      try {
        const parsed = JSON.parse(strapiText);
        errMsg =
          parsed?.error?.message ||
          parsed?.message ||
          JSON.stringify(parsed);
      } catch {
        errMsg = strapiText;
      }

      return NextResponse.json({ error: errMsg }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Lead creation error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
