import { headers } from "next/headers";

/**
 * URL absoluta del sitio, para armar el contenido del QR.
 * Prioridad: NEXT_PUBLIC_SITE_URL > host del pedido > VERCEL_URL > localhost.
 */
export async function urlBase(): Promise<string> {
  const configurada = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configurada) {
    return configurada.replace(/\/+$/, "");
  }

  const cabeceras = await headers();
  const host = cabeceras.get("x-forwarded-host") ?? cabeceras.get("host");
  if (host) {
    const esLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
    const protocolo = cabeceras.get("x-forwarded-proto") ?? (esLocal ? "http" : "https");
    return `${protocolo}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
