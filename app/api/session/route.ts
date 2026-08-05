import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {

  const cookieStore = await cookies();

  const session = cookieStore.get("integrante");

  if (!session) {

    return NextResponse.json({
      logged: false,
    });

  }

  return NextResponse.json({
    logged: true,
    user: JSON.parse(session.value),
  });

}