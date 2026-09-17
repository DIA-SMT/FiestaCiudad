"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FOTOS = [
  {
    src: "/avenida-mate-de-luna.jpg",
    alt: "Lapachos en flor sobre la avenida Mate de Luna",
    titulo: "Avenida Mate de Luna",
  },
  {
    src: "/palacio-de-los-deportes.jpeg",
    alt: "Palacio de los Deportes iluminado durante la noche",
    titulo: "Palacio de los Deportes",
  },
  {
    src: "/puente-mate-de-luna.jpeg",
    alt: "Puente peatonal iluminado sobre la avenida Mate de Luna",
    titulo: "Puente de Mate de Luna",
  },
  {
    src: "/catedral-smt.jpeg",
    alt: "Catedral de San Miguel de Tucumán iluminada",
    titulo: "Catedral de San Miguel de Tucumán",
  },
  {
    src: "/casa-historica.jpg",
    alt: "Casa Histórica de la Independencia",
    titulo: "Casa Histórica",
  },
];

export default function GaleriaCiudad() {
  const [actual, setActual] = useState(0);
  const [abierta, setAbierta] = useState(false);
  const [pausada, setPausada] = useState(false);
  const abrirRef = useRef<HTMLButtonElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  const anterior = () => setActual((indice) => (indice - 1 + FOTOS.length) % FOTOS.length);
  const siguiente = () => setActual((indice) => (indice + 1) % FOTOS.length);

  useEffect(() => {
    if (pausada || abierta || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const intervalo = window.setInterval(siguiente, 4800);
    return () => window.clearInterval(intervalo);
  }, [pausada, abierta]);

  useEffect(() => {
    if (!abierta) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cerrarRef.current?.focus();

    const manejarTeclado = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbierta(false);
      if (evento.key === "ArrowLeft") anterior();
      if (evento.key === "ArrowRight") siguiente();
    };
    window.addEventListener("keydown", manejarTeclado);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", manejarTeclado);
      abrirRef.current?.focus();
    };
  }, [abierta]);

  return (
    <>
      <div
        className="galeria-ciudad entrada-hero"
        onMouseEnter={() => setPausada(true)}
        onMouseLeave={() => setPausada(false)}
        onFocusCapture={() => setPausada(true)}
        onBlurCapture={() => setPausada(false)}
      >
        <button
          ref={abrirRef}
          type="button"
          className="galeria-portada"
          onClick={() => setAbierta(true)}
          aria-label={`Ampliar foto: ${FOTOS[actual].titulo}`}
        >
          {FOTOS.map((foto, indice) => (
            <Image
              key={foto.src}
              src={foto.src}
              alt={indice === actual ? foto.alt : ""}
              fill
              priority={indice === 0}
              sizes="(max-width: 760px) 100vw, 42vw"
              className={`galeria-imagen ${indice === actual ? "galeria-imagen-activa" : ""}`}
            />
          ))}
          <span className="galeria-velo" />
          <span className="galeria-titulo">{FOTOS[actual].titulo}</span>
          <span className="galeria-ampliar" aria-hidden="true">Ver foto <span>↗</span></span>
        </button>

        <div className="galeria-indicadores" aria-label="Elegir foto">
          {FOTOS.map((foto, indice) => (
            <button
              type="button"
              key={foto.src}
              className={indice === actual ? "activo" : ""}
              onClick={() => setActual(indice)}
              aria-label={`Mostrar ${foto.titulo}`}
              aria-current={indice === actual ? "true" : undefined}
            />
          ))}
        </div>
      </div>

      {abierta ? createPortal(
        <div className="visor-galeria" role="dialog" aria-modal="true" aria-label="Galería de San Miguel de Tucumán">
          <button className="visor-fondo" type="button" tabIndex={-1} onClick={() => setAbierta(false)} aria-label="Cerrar galería" />
          <div className="visor-contenido">
            <div className="visor-imagen">
              <Image src={FOTOS[actual].src} alt={FOTOS[actual].alt} fill priority sizes="95vw" />
            </div>
            <div className="visor-pie">
              <div><strong>{FOTOS[actual].titulo}</strong><span>{actual + 1} / {FOTOS.length}</span></div>
              <div className="visor-controles">
                <button type="button" onClick={anterior} aria-label="Foto anterior">←</button>
                <button type="button" onClick={siguiente} aria-label="Foto siguiente">→</button>
              </div>
            </div>
          </div>
          <button ref={cerrarRef} className="visor-cerrar" type="button" onClick={() => setAbierta(false)} aria-label="Cerrar galería">×</button>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
