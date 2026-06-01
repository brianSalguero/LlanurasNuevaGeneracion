import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // LOGIN PANEL
  if (
    body.user === adminUser &&
    body.password === adminPassword
  ) {
    return NextResponse.json({
      success: true,
    });
  }

  return NextResponse.json({
    success: false,
    error: 'Credenciales incorrectas',
  });
}