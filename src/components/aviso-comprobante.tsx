"use client";

import { useEffect, useState } from "react";

import { COOKIE_COMPROBANTE } from "@/lib/formulario";

/**
 * Si esta persona ya se preinscribio desde este navegador, le ofrece volver a
 * su comprobante. Resuelve el caso mas comun de comprobante perdido: cerrar la
 * pestana sin descargar el QR.
 *
 * Se resuelve en el cliente a proposito: asi la landing sigue siendo estatica
 * y no hay que renderizarla de nuevo en cada visita.
 */
export default function AvisoComprobante() {
  const [codigo, setCodigo] = useState<string | null>(null);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((entrada) => entrada.startsWith(`${COOKIE_COMPROBANTE}=`));
    if (!cookie) return;

    const valor = decodeURIComponent(cookie.slice(COOKIE_COMPROBANTE.length + 1));
    // Mismo formato que valida el servidor: token de 32 bytes en base64url.
    if (/^[A-Za-z0-9_-]{22,64}$/.test(valor)) setCodigo(valor);
  }, []);

  if (!codigo) return null;

  return (
    <div className="mb-6 rounded-xl border border-smt-linea bg-[#f7faff] p-4 text-sm leading-relaxed text-smt-texto">
      <p className="font-bold text-smt-tinta">Ya tenés una preinscripción desde este dispositivo.</p>
      <p className="mt-1">
        Si perdiste el comprobante, podés volver a abrirlo y descargar el QR.
      </p>
      <a
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-smt-linea bg-white px-4 py-2.5 font-bold text-smt-azul transition-colors hover:border-smt-medio hover:bg-white"
        href={"/confirmacion/" + codigo}
      >
        Ver mi comprobante
      </a>
    </div>
  );
}
