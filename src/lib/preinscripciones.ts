import "server-only";

import { clienteServicio } from "@/lib/supabase";

export type Preinscripcion = {
  nombre_completo: string;
  estado: string;
  creado_en: string;
};

/** Formato del token: 32 bytes en base64url. */
export const RE_CODIGO = /^[A-Za-z0-9_-]{22,64}$/;

/**
 * Busca una preinscripcion por su codigo de verificacion.
 * Corre con la service role key, exclusivamente en el servidor.
 * Devuelve solo los campos que las pantallas muestran:
 * nunca telefono, mail ni direccion.
 */
export async function buscarPorCodigo(codigo: string): Promise<Preinscripcion | null> {
  const limpio = codigo?.trim() ?? "";

  // Descarta codigos con formato invalido antes de ir a la base.
  if (!RE_CODIGO.test(limpio)) {
    return null;
  }

  const { data, error } = await clienteServicio()
    .from("preinscripciones")
    .select("nombre_completo, estado, creado_en")
    .eq("codigo_verificacion", limpio)
    .maybeSingle();

  if (error) {
    console.error("[preinscripciones] error al verificar el código:", error.message);
    throw new Error("No pudimos consultar la preinscripción.");
  }

  return (data as Preinscripcion | null) ?? null;
}
