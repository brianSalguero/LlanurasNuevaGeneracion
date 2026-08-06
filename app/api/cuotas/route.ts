import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const nombresMeses = [
  "",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export async function POST(req: NextRequest) {
  try {
    const { integrante_id, mes, anio, responsable_id } = await req.json();

    if (!integrante_id || !mes || !anio || !responsable_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Faltan datos.",
        },
        {
          status: 400,
        }
      );
    }

    // Registrar cuota
    const { error: cuotaError } = await supabase
      .from("cuotas")
      .insert({
        integrante_id,
        mes,
        anio,
      });

    if (cuotaError) {
      console.error("ERROR CUOTA:", cuotaError);
      throw cuotaError;
    }

    // Obtener integrante
    const { data: integrante, error: integranteError } = await supabase
      .from("integrantes")
      .select("nombre, apellido")
      .eq("id", integrante_id)
      .single();

    if (integranteError) {
      console.error("ERROR INTEGRANTE:", integranteError);
      throw integranteError;
    }

    // Registrar movimiento
    const movimiento = await supabase
      .from("movimientos")
      .insert({
        tipo: "cuota",
        categoria: "Cuotas",
        concepto: `Cuota ${nombresMeses[mes]} ${anio} - ${integrante.nombre} ${integrante.apellido}`,
        importe: 5,
        responsable_id,
        fecha: new Date().toISOString(),
      });

    if (movimiento.error) {
      console.error("ERROR MOVIMIENTO:", movimiento.error);
      throw movimiento.error;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        error,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("cuotas")
    .select("*");

  if (error) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    success: true,
    cuotas: data,
  });
}

export async function DELETE(req: NextRequest) {
  try {
    const { integrante_id, mes, anio, responsable_id } = await req.json();

    if (!integrante_id || !mes || !anio || !responsable_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Faltan datos.",
        },
        {
          status: 400,
        }
      );
    }

    // Obtener integrante antes de borrar
    const { data: integrante, error: integranteError } = await supabase
      .from("integrantes")
      .select("nombre, apellido")
      .eq("id", integrante_id)
      .single();

    if (integranteError) throw integranteError;

    // Eliminar cuota
    const { error } = await supabase
      .from("cuotas")
      .delete()
      .eq("integrante_id", integrante_id)
      .eq("mes", mes)
      .eq("anio", anio);

    if (error) throw error;

    // Registrar movimiento negativo
    const { error: movimientoError } = await supabase
      .from("movimientos")
      .insert({
        tipo: "cuota",
        categoria: "Cuotas",
        concepto: `-5€ Cuota ${nombresMeses[mes]} ${anio} - ${integrante.nombre} ${integrante.apellido}`,
        importe: -5,
        responsable_id,
        fecha: new Date().toISOString(),
      });

    if (movimientoError) throw movimientoError;

    return NextResponse.json({
      success: true,
    });

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