import "server-only";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";

import { clienteServicio } from "@/lib/supabase";

/**
 * Limite de preinscripciones por IP, para que nadie pueda llenar el padron.
 *
 * Son generosos a proposito: en una oficina, un locutorio o el wifi municipal
 * muchas personas comparten una misma IP publica.
 */
export const LIMITE_POR_HORA = 8;
export const LIMITE_POR_DIA = 30;

/** A las 48 h los intentos ya no sirven para nada y se borran. */
const HORAS_RETENCION = 48;

export type ResultadoLimite = {
  permitido: boolean;
  /** Mensaje para la persona cuando se la frena. */
  mensaje?: string;
};

/**
 * Hash de la IP con clave del servidor. Nunca se guarda la IP en claro:
 * asi la tabla de intentos no es un registro de navegacion reidentificable.
 */
function hashearIp(ip: string): string {
  const clave = process.env.SALT_IP || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createHmac("sha256", clave).update(ip).digest("hex");
}

/** IP del visitante segun las cabeceras que pone el proxy de Vercel. */
async function ipDelPedido(): Promise<string> {
  const cabeceras = await headers();
  const reenviada = cabeceras.get("x-forwarded-for");
  if (reenviada) {
    // La primera de la lista es el cliente original.
    const primera = reenviada.split(",")[0]?.trim();
    if (primera) return primera;
  }
  return cabeceras.get("x-real-ip")?.trim() || "desconocida";
}

export async function huellaDelPedido(): Promise<string> {
  return hashearIp(await ipDelPedido());
}

/**
 * Cuenta los intentos recientes de esa IP y decide si se la deja seguir.
 *
 * Falla ABIERTO a proposito: si la consulta se rompe (por ejemplo, porque
 * todavia no se corrio migration-002), se permite la preinscripcion. Es
 * preferible un limitador que no frena a una landing que no deja anotarse.
 */
export async function verificarLimite(ipHash: string): Promise<ResultadoLimite> {
  const ahora = Date.now();
  const desdeDia = new Date(ahora - 24 * 60 * 60 * 1000).toISOString();

  try {
    const { data, error } = await clienteServicio()
      .from("intentos_preinscripcion")
      .select("creado_en")
      .eq("ip_hash", ipHash)
      .gte("creado_en", desdeDia);

    if (error) {
      console.error("[limites] no se pudo consultar el límite:", error.message);
      return { permitido: true };
    }

    const intentos = data ?? [];
    if (intentos.length >= LIMITE_POR_DIA) {
      return {
        permitido: false,
        mensaje:
          "Se alcanzó el máximo de preinscripciones desde esta conexión por hoy. Probá de nuevo mañana o escribinos por los canales oficiales del municipio.",
      };
    }

    const haceUnaHora = ahora - 60 * 60 * 1000;
    const enLaHora = intentos.filter(
      (fila) => new Date(fila.creado_en as string).getTime() >= haceUnaHora,
    ).length;

    if (enLaHora >= LIMITE_POR_HORA) {
      return {
        permitido: false,
        mensaje:
          "Hubo demasiadas preinscripciones desde esta conexión en la última hora. Esperá un rato y volvé a intentar.",
      };
    }

    return { permitido: true };
  } catch (error) {
    console.error("[limites] error inesperado al verificar el límite:", error);
    return { permitido: true };
  }
}

/** Deja constancia del intento. Nunca interrumpe la preinscripcion si falla. */
export async function registrarIntento(ipHash: string): Promise<void> {
  try {
    const supabase = clienteServicio();
    await supabase.from("intentos_preinscripcion").insert({ ip_hash: ipHash });

    // Purga oportunista y barata: 1 de cada 20 intentos limpia lo viejo.
    if (Math.random() < 0.05) {
      const limite = new Date(Date.now() - HORAS_RETENCION * 60 * 60 * 1000).toISOString();
      await supabase.from("intentos_preinscripcion").delete().lt("creado_en", limite);
    }
  } catch (error) {
    console.error("[limites] no se pudo registrar el intento:", error);
  }
}
