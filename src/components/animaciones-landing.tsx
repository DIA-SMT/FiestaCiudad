"use client";
import { useEffect } from "react";

/** Sin JavaScript o con movimiento reducido, todo sigue visible. */
export function AnimacionesLanding() {
  useEffect(() => {
    const preferencia = window.matchMedia("(prefers-reduced-motion: reduce)");
    let limpiar = () => {};
    const iniciar = () => {
      limpiar();
      if (preferencia.matches) return;
      const elementos = document.querySelectorAll<HTMLElement>("[data-reveal]");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revelado");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      elementos.forEach((elemento) => {
        if (elemento.getBoundingClientRect().top > window.innerHeight) elemento.classList.add("revelar-pendiente");
        observer.observe(elemento);
      });
      const visual = document.querySelector<HTMLElement>("[data-parallax]");
      let frame = 0;
      const actualizar = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          visual?.style.setProperty("--desplazamiento-foto", `${Math.min(window.scrollY * 0.075, 55)}px`);
          frame = 0;
        });
      };
      window.addEventListener("scroll", actualizar, { passive: true });
      limpiar = () => {
        observer.disconnect();
        window.removeEventListener("scroll", actualizar);
        cancelAnimationFrame(frame);
        elementos.forEach((elemento) => elemento.classList.remove("revelar-pendiente", "revelado"));
        visual?.style.removeProperty("--desplazamiento-foto");
      };
    };
    iniciar();
    preferencia.addEventListener("change", iniciar);
    return () => { limpiar(); preferencia.removeEventListener("change", iniciar); };
  }, []);
  return null;
}
