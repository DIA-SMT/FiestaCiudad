import type { Metadata } from "next";

import { fechaLegible } from "@/lib/formato";
import { buscarPorCodigo, type Preinscripcion } from "@/lib/preinscripciones";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verificación de preinscripción — Fiesta de la Ciudad",
  robots: { index: false, follow: false },
};

type Resultado =
  | { tipo: "valida"; preinscripcion: Preinscripcion }
  | { tipo: "anulada"; preinscripcion: Preinscripcion }
  | { tipo: "invalida" }
  | { tipo: "error" };

const ESTILOS = {
  valida: { fondo: "bg-smt-verde", texto: "text-white" },
  anulada: { fondo: "bg-smt-ambar", texto: "text-white" },
  invalida: { fondo: "bg-smt-rojo", texto: "text-white" },
  error: { fondo: "bg-smt-ambar", texto: "text-white" },
} as const;

function IconoCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true" className="h-16 w-16 sm:h-20 sm:w-20">
      <path d="M4 12.5 9.5 18 20 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoCruz() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true" className="h-16 w-16 sm:h-20 sm:w-20">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoAlerta() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true" className="h-16 w-16 sm:h-20 sm:w-20">
      <path d="M12 8v5" strokeLinecap="round" />
      <path d="M12 17h.01" strokeLinecap="round" />
      <path d="M10.3 3.9 2.5 18a1.9 1.9 0 0 0 1.7 2.9h15.6a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z" strokeLinejoin="round" />
    </svg>
  );
}

async function resolver(codigo: string): Promise<Resultado> {
  try {
    const preinscripcion = await buscarPorCodigo(codigo);
    if (!preinscripcion) return { tipo: "invalida" };
    if (preinscripcion.estado !== "confirmado") return { tipo: "anulada", preinscripcion };
    return { tipo: "valida", preinscripcion };
  } catch {
    return { tipo: "error" };
  }
}

export default async function PaginaVerificacion({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const resultado = await resolver(codigo);
  const estilo = ESTILOS[resultado.tipo];

  const titulo =
    resultado.tipo === "valida"
      ? "Preinscripción confirmada"
      : resultado.tipo === "anulada"
        ? "Preinscripción anulada"
        : resultado.tipo === "invalida"
          ? "Código no válido"
          : "No pudimos verificar";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center px-5 py-12 text-center ${estilo.fondo} ${estilo.texto}`}
    >
      <div role="status" className="flex w-full max-w-md flex-col items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/20 sm:h-32 sm:w-32">
          {resultado.tipo === "valida" ? (
            <IconoCheck />
          ) : resultado.tipo === "invalida" ? (
            <IconoCruz />
          ) : (
            <IconoAlerta />
          )}
        </div>

        <h1 className="mt-8 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          {titulo}
        </h1>

        {resultado.tipo === "valida" || resultado.tipo === "anulada" ? (
          <div className="mt-8 w-full rounded-2xl bg-white/15 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">
              Nombre completo
            </p>
            <p className="mt-1.5 text-2xl font-extrabold leading-tight text-white">
              {resultado.preinscripcion.nombre_completo}
            </p>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-white/80">
              Preinscripción
            </p>
            <p className="mt-1.5 text-base font-bold text-white">
              {fechaLegible(resultado.preinscripcion.creado_en)}
            </p>
          </div>
        ) : null}

        <p className="mt-8 text-base leading-relaxed text-white/90">
          {resultado.tipo === "valida"
            ? "El ingreso está habilitado."
            : resultado.tipo === "anulada"
              ? "Esta preinscripción fue dada de baja. No habilita el ingreso."
              : resultado.tipo === "invalida"
                ? "Este código no corresponde a ninguna preinscripción."
                : "Hubo un problema al consultar la preinscripción. Volvé a escanear el código."}
        </p>

        <p className="mt-10 text-sm font-bold uppercase tracking-[0.14em] text-white/70">
          Fiesta de la Ciudad — San Miguel de Tucumán
        </p>
      </div>
    </main>
  );
}
