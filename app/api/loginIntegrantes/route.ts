import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { usuario, password } = await req.json();

    const { data: integrante, error } = await supabase
      .from("integrantes")
      .select("*")
      .eq("usuario", usuario)
      .single();

    if (error || !integrante) {
      return NextResponse.json(
        { success: false, message: "Usuario incorrecto." },
        { status: 401 }
      );
    }

    if (integrante.contrasena !== password) {
      return NextResponse.json(
        { success: false, message: "Contraseña incorrecta." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: integrante.id,
        nombre: integrante.nombre,
        apellido: integrante.apellido,
        rol: integrante.rol,
      },
    });

    response.cookies.set("integrante", JSON.stringify({
      id: integrante.id,
      nombre: integrante.nombre,
      apellido: integrante.apellido,
      rol: integrante.rol,
      imagen: integrante.imagen
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;

  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Error interno."
      },
      {
        status: 500
      }
    );
  }
}