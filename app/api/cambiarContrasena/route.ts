import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { id, passwordActual, passwordNueva } = await req.json();

    if (!id || !passwordActual || !passwordNueva) {
      return NextResponse.json(
        {
          success: false,
          message: "Faltan datos."
        },
        {
          status: 400
        }
      );
    }

    if (passwordNueva.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "La nueva contraseña debe tener al menos 8 caracteres."
        },
        {
          status: 400
        }
      );
    }

    const { data: integrante, error } = await supabaseAdmin
      .from("integrantes")
      .select("id, contrasena")
      .eq("id", id)
      .single();

    if (error || !integrante) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario no encontrado."
        },
        {
          status: 404
        }
      );
    }

    const correcta = await bcrypt.compare(
      passwordActual,
      integrante.contrasena
    );

    if (!correcta) {
      return NextResponse.json(
        {
          success: false,
          message: "La contraseña actual es incorrecta."
        },
        {
          status: 401
        }
      );
    }

    const hash = await bcrypt.hash(passwordNueva, 12);

    const { error: updateError } = await supabaseAdmin
      .from("integrantes")
      .update({
        contrasena: hash
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: "No se pudo actualizar la contraseña."
        },
        {
          status: 500
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada correctamente."
    });

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