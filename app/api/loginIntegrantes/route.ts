import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { usuario, password } = await req.json();

    const { data: integrante, error } = await supabase
      .from("integrantes")
      .select("*")
      .eq("usuario", usuario)
      .single();

    const hashFalso =
      "$2b$12$4g7Xf6b4x8M0Gv3zX4Q4He7U3iJf8D4Y5e8P9N0Q1R2S3T4U5V6W";

    const hash = integrante?.contrasena ?? hashFalso;
    const passwordCorrecta = await bcrypt.compare(password, hash);

    if (error || !integrante || !passwordCorrecta) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario o contraseña incorrectos.",
        },
        {
          status: 401,
        }
      );
    }

    const user = {
      id: integrante.id,
      usuario: integrante.usuario,
      nombre: integrante.nombre,
      apellido: integrante.apellido,
      rol: integrante.rol,
      imagen: integrante.imagen,
      fecha_alta: integrante.fecha_alta,
      inicio_cuotas: integrante.inicio_cuotas,
    };

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set("integrante", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      priority: "high",
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno.",
      },
      {
        status: 500,
      }
    );
  }
}