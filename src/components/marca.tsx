import type { ReactNode } from "react";

/**
 * Espacio reservado para el logo institucional en blanco.
 * El archivo se carga en /public/logo-smt-blanco.png; mientras no exista,
 * el bloque queda vacio y no rompe la maqueta.
 */
export function LogoSmt({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Ciudad San Miguel de Tucumán"
      className={`h-12 w-44 bg-[url('/logo-smt-blanco.png')] bg-contain bg-left bg-no-repeat ${className}`}
    />
  );
}

/** Linea fina que cierra el hero: 22 % amarillo institucional, el resto celeste. */
export function LineaInstitucional() {
  return (
    <div aria-hidden="true" className="flex h-1.5 w-full">
      <span className="h-full w-[22%] bg-smt-amarillo" />
      <span className="h-full flex-1 bg-smt-celeste" />
    </div>
  );
}

/** Titulo de seccion con la barrita vertical azul-celeste a la izquierda. */
export function TituloSeccion({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="h-7 w-1.5 rounded-full bg-gradient-to-b from-smt-azul to-smt-celeste"
      />
      <h2 id={id} className="text-2xl leading-tight sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

export function PieInstitucional() {
  return (
    <footer className="mt-12 border-t border-smt-linea bg-white">
      <div className="mx-auto max-w-contenido px-5 py-8 text-sm text-smt-gris sm:px-8">
        <p className="font-bold text-smt-tinta">Municipalidad de San Miguel de Tucumán</p>
        <p className="mt-1">
          Los datos de la preinscripción se usan únicamente para organizar el ingreso al evento.
        </p>
      </div>
    </footer>
  );
}
