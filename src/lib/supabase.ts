import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Clientes de Supabase. Los dos se usan unicamente del lado del servidor:
 * la tabla `preinscripciones` nunca se consulta desde el navegador.
 */

function variableRequerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(
      `Falta la variable de entorno ${nombre}. Copiá .env.example a .env.local y completala.`,
    );
  }
  return valor;
}

const opciones = { auth: { persistSession: false, autoRefreshToken: false } } as const;

/**
 * Cliente con la clave anonima: respeta RLS, asi que solo puede insertar.
 * Lo usa el server action de preinscripcion.
 */
export function clienteAnonimo(): SupabaseClient {
  return createClient(
    variableRequerida("NEXT_PUBLIC_SUPABASE_URL"),
    variableRequerida("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    opciones,
  );
}

/**
 * Cliente con la service role key: omite RLS.
 * Solo para la lectura de verificacion del QR, siempre en el servidor.
 */
export function clienteServicio(): SupabaseClient {
  return createClient(
    variableRequerida("NEXT_PUBLIC_SUPABASE_URL"),
    variableRequerida("SUPABASE_SERVICE_ROLE_KEY"),
    opciones,
  );
}
