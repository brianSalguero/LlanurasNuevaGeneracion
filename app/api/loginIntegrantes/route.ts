import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { usuario, password } = await req.json();

    if (!usuario || !password) {
      return NextResponse.json(
        { success: false, message: "Faltan datos." },
        { status: 400 }
      );
    }

    const { data: integrante, error } = await supabase
      .from("integrantes")
      .select("*")
      .eq("usuario", usuario)
      .single();
      

    if (error || !integrante) {
      return NextResponse.json(
        { success: false, message: "Usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    // De momento contraseña en texto plano
    if (integrante.contrasena !== password) {
      return NextResponse.json(
        { success: false, message: "Usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: integrante.id,
        nombre: integrante.nombre,
        apellido: integrante.apellido,
        rol: integrante.rol,
        imagen: integrante.imagen,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}