import Image from "next/image";

import FormularioPreinscripcion from "@/components/formulario-preinscripcion";
import { LineaInstitucional, LogoSmt, PieInstitucional, TituloSeccion } from "@/components/marca";

const PASOS = [
  {
    titulo: "Completá el formulario",
    detalle: "Cargá tus datos una sola vez. Un mail equivale a una preinscripción.",
  },
  {
    titulo: "Guardá tu QR",
    detalle: "Al confirmar te mostramos el comprobante. Descargalo o compartilo con vos mismo.",
  },
  {
    titulo: "Presentalo en el ingreso",
    detalle: "El personal del evento escanea el QR y valida tu preinscripción en el momento.",
  },
];

export default function PaginaPrincipal() {
  return (
    <>
      <header className="hero relative isolate overflow-hidden bg-smt-oscuro text-white">
        {/* Foto de los lapachos en flor sobre Avenida Mate de Luna, como textura del hero. */}
        <Image
          src="/hero-lapachos.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="mx-auto max-w-contenido px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
          <LogoSmt />

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-white">
            Municipalidad de San Miguel de Tucumán
          </p>

          <h1 className="mt-3 max-w-3xl text-3xl leading-tight text-white sm:text-5xl">
            Fiesta de la Ciudad — San Miguel de Tucumán
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            Una jornada abierta para celebrar a la ciudad, con música, gastronomía y actividades
            para toda la familia. La fecha y la sede se informan por los canales oficiales del
            municipio.
          </p>

          <p className="mt-6 max-w-2xl text-base font-bold text-white">
            Preinscribite y recibí tu comprobante con código QR para ingresar sin demoras.
          </p>

          <a
            href="#preinscripcion"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-smt-amarillo px-6 py-3.5 text-base font-bold text-smt-tinta transition-colors hover:bg-[#e6ce16]"
          >
            Ir a la preinscripción
          </a>
        </div>
        <LineaInstitucional />
      </header>

      <main className="mx-auto max-w-contenido px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
          <section id="preinscripcion" className="tarjeta p-6 sm:p-8 lg:col-span-3" aria-labelledby="titulo-preinscripcion">
            <TituloSeccion id="titulo-preinscripcion">Preinscripción</TituloSeccion>
            <p className="mt-3 text-base leading-relaxed text-smt-texto">
              Todos los campos son obligatorios. Revisá que el mail sea correcto: es el dato con el
              que identificamos tu preinscripción.
            </p>
            <FormularioPreinscripcion />
          </section>

          <aside className="tarjeta p-6 sm:p-8 lg:col-span-2" aria-labelledby="titulo-pasos">
            <TituloSeccion id="titulo-pasos">Cómo funciona</TituloSeccion>
            <ol className="mt-5 space-y-5">
              {PASOS.map((paso, indice) => (
                <li key={paso.titulo} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf2ff] text-base font-extrabold text-smt-profundo"
                  >
                    {indice + 1}
                  </span>
                  <div>
                    <p className="font-bold text-smt-tinta">{paso.titulo}</p>
                    <p className="mt-1 text-sm leading-relaxed text-smt-texto">{paso.detalle}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-6 rounded-xl border border-smt-linea bg-[#f7faff] p-4 text-sm leading-relaxed text-smt-gris">
              La preinscripción es gratuita y personal. No compartas tu código QR: es tu
              comprobante de ingreso.
            </p>
          </aside>
        </div>
      </main>

      <PieInstitucional />
    </>
  );
}
