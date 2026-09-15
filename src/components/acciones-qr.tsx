"use client";

import { useState } from "react";

const NOMBRE_ARCHIVO = "preinscripcion-fiesta-smt.png";

export default function AccionesQr({ imagenQr, enlace }: { imagenQr: string; enlace: string }) {
  const [aviso, setAviso] = useState<string | null>(null);

  async function compartir() {
    // En celulares se abre el menu nativo; si no esta disponible, se copia el enlace.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Preinscripción — Fiesta de la Ciudad",
          text: "Mi comprobante de preinscripción a la Fiesta de la Ciudad de San Miguel de Tucumán.",
          url: enlace,
        });
        return;
      } catch {
        // El usuario cerro el menu o el navegador rechazo el pedido: seguimos con copiar.
      }
    }

    try {
      await navigator.clipboard.writeText(enlace);
      setAviso("Enlace copiado.");
    } catch {
      setAviso("No pudimos copiar el enlace. Copialo manualmente desde la barra de direcciones.");
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <a className="boton-primario" href={imagenQr} download={NOMBRE_ARCHIVO}>
          Descargar QR
        </a>
        <button type="button" className="boton-secundario" onClick={compartir}>
          Compartir enlace
        </button>
      </div>
      <p aria-live="polite" className="ayuda min-h-5">
        {aviso}
      </p>
    </div>
  );
}
