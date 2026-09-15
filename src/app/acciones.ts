"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";

import { ESTADO_INICIAL, type EstadoFormulario } from "@/lib/formulario";
import { clienteAnonimo } from "@/lib/supabase";
import {
  hayErrores,
  normalizarCampos,
  validarPreinscripcion,
  type CamposPreinscripcion,
} from "@/lib/validacion";

/** Token aleatorio de 32 bytes en base64url: 43 caracteres, no adivinable. */
function generarCodigo(): string {
  return randomBytes(32).toString("base64url");
}

function leerCampos(formData: FormData): CamposPreinscripcion {
  const texto = (campo: string) => String(formData.get(campo) ?? "");
  return {
    nombre_completo: texto("nombre_completo"),
    telefono: texto("telefono"),
    mail: texto("mail"),
    direccion: texto("direccion"),
  };
}

export async function preinscribir(
  _estadoPrevio: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const valores = normalizarCampos(leerCampos(formData));

  // Validacion del lado del servidor: no depende de lo que haga el navegador.
  const errores = validarPreinscripcion(valores);
  if (hayErrores(errores)) {
    return { ...ESTADO_INICIAL, errores, valores };
  }

  const supabase = clienteAnonimo();
  let codigo = "";

  // El token es aleatorio; el reintento cubre una colision practicamente imposible.
  for (let intento = 0; intento < 3; intento += 1) {
    const candidato = generarCodigo();
    const { error } = await supabase.from("preinscripciones").insert({
      nombre_completo: valores.nombre_completo,
      telefono: valores.telefono,
      mail: valores.mail,
      direccion: valores.direccion,
      codigo_verificacion: candidato,
    });

    if (!error) {
      codigo = candidato;
      break;
    }

    // 23505: violacion de unicidad.
    if (error.code === "23505") {
      const detalle = `${error.message} ${error.details ?? ""}`.toLowerCase();
      if (detalle.includes("codigo_verificacion")) {
        continue;
      }
      return {
        ...ESTADO_INICIAL,
        valores,
        errores: { mail: "Ese mail ya está preinscripto." },
        mensaje:
          "Ese mail ya está preinscripto. Si no encontrás tu comprobante, escribinos por los canales oficiales del municipio.",
        tono: "advertencia",
      };
    }

    console.error("[preinscripcion] error al insertar:", error.message);
    return {
      ...ESTADO_INICIAL,
      valores,
      mensaje: "No pudimos registrar la preinscripción. Probá de nuevo en unos minutos.",
      tono: "error",
    };
  }

  if (!codigo) {
    return {
      ...ESTADO_INICIAL,
      valores,
      mensaje: "No pudimos generar tu comprobante. Probá de nuevo en unos minutos.",
      tono: "error",
    };
  }

  // redirect() lanza una excepcion de control: va fuera de cualquier try/catch.
  redirect(`/confirmacion/${codigo}`);
}
