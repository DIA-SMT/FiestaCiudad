import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";

import AccionesQr from "@/components/acciones-qr";
import { LineaInstitucional, LogoSmt, PieInstitucional, TituloSeccion } from "@/components/marca";
import { buscarPorCodigo } from "@/lib/preinscripciones";
import { urlBase } from "@/lib/url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preinscripción confirmada — Fiesta de la Ciudad",
  robots: { index: false, follow: false },
};

function Encabezado({ titulo }: { titulo: string }) {
  return (
    <header className="hero bg-hero-smt text-white">
      <div className="mx-auto max-w-contenido px-5 pb-10 pt-8 sm:px-8 sm:pt-10">
        <LogoSmt />
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-white">
          Fiesta de la Ciudad — San Miguel de Tucumán
        </p>
        <h1 className="mt-3 text-3xl leading-tight text-white sm:text-4xl">{titulo}</h1>
      </div>
      <LineaInstitucional />
    </header>
  );
}

export default async function PaginaConfirmacion({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const preinscripcion = await buscarPorCodigo(codigo);

  if (!preinscripcion) {
    return (
      <>
        <Encabezado titulo="No encontramos esa preinscripción" />
        <main className="mx-auto max-w-contenido px-5 py-10 sm:px-8 sm:py-14">
          <section className="tarjeta p-6 sm:p-8">
            <p className="text-base leading-relaxed text-smt-texto">
              El enlace que abriste no corresponde a ninguna preinscripción. Puede que esté
              incompleto o que haya sido reemplazado.
            </p>
            <Link href="/" className="boton-primario mt-6">
              Volver a la preinscripción
            </Link>
          </section>
        </main>
        <PieInstitucional />
      </>
    );
  }

  const enlace = `${await urlBase()}/verificar/${codigo}`;
  const imagenQr = await QRCode.toDataURL(enlace, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 640,
    color: { dark: "#10233dff", light: "#ffffffff" },
  });

  return (
    <>
      <Encabezado titulo="¡Preinscripción confirmada!" />

      <main className="mx-auto max-w-contenido px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
          <section className="tarjeta p-6 sm:p-8 lg:col-span-3" aria-labelledby="titulo-comprobante">
            <TituloSeccion id="titulo-comprobante">Tu comprobante</TituloSeccion>

            <p className="mt-4 text-base leading-relaxed text-smt-texto">
              Listo,{" "}
              <strong className="text-smt-tinta">{preinscripcion.nombre_completo}</strong>. Tu
              preinscripción a la Fiesta de la Ciudad quedó registrada.
            </p>

            <div className="mt-6 flex justify-center rounded-2xl border border-smt-linea bg-white p-4 sm:p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagenQr}
                alt="Código QR de tu preinscripción a la Fiesta de la Ciudad"
                width={320}
                height={320}
                className="h-auto w-full max-w-[320px]"
              />
            </div>

            <AccionesQr imagenQr={imagenQr} enlace={enlace} />
          </section>

          <aside className="tarjeta p-6 sm:p-8 lg:col-span-2" aria-labelledby="titulo-instrucciones">
            <TituloSeccion id="titulo-instrucciones">Qué hacer ahora</TituloSeccion>
            <p className="mt-4 text-base leading-relaxed text-smt-texto">
              Este QR es tu comprobante de preinscripción. Presentalo el día del evento en el
              ingreso: lo escanean y validan tu registro en el momento.
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-smt-texto">
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold text-smt-celeste">
                  —
                </span>
                Descargalo o sacale una captura: no necesitás conexión para mostrarlo.
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="font-bold text-smt-celeste">
                  —
                </span>
                Es personal. No lo publiques ni lo compartas con otras personas.
              </li>
            </ul>

            <Link href="/" className="boton-secundario mt-6">
              Volver al inicio
            </Link>
          </aside>
        </div>
      </main>

      <PieInstitucional />
    </>
  );
}
