import type { ReactNode, SVGProps } from "react";

export function Flor(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" {...props}>{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="50" cy="25" rx="13" ry="24" transform={`rotate(${i * 45} 50 50)`} />)}<circle cx="50" cy="50" r="12" fill="var(--flor-centro, #fff8ed)" /></svg>;
}

type NombreIcono = "flecha" | "check" | "musica" | "comida" | "sol" | "calendario" | "persona" | "ticket" | "estrella" | "escudo" | "mail" | "telefono" | "ubicacion";
const trazos: Record<NombreIcono, ReactNode> = {
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  musica: <><path d="M9 18V5l11-2v13M9 9l11-2" /><ellipse cx="6" cy="18" rx="3" ry="3" /><ellipse cx="17" cy="16" rx="3" ry="3" /></>,
  comida: <path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18M20 21V3c-5 2-5 11 0 11" />,
  sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></>,
  calendario: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2" /></>,
  persona: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
  ticket: <><path d="M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4Z" /><path d="M15 5v3m0 3v2m0 3v3" /></>,
  estrella: <path d="m12 2 2.7 6.7L22 12l-7.3 3.3L12 22l-2.7-6.7L2 12l7.3-3.3Z" />,
  escudo: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" /><path d="m8 12 3 3 5-6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>,
  telefono: <path d="m8 3-4 1c-3 8 8 19 16 16l1-4-5-2-2 2c-3-1-5-3-6-6l2-2Z" />,
  ubicacion: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
};
export function Icono({ nombre, ...props }: SVGProps<SVGSVGElement> & { nombre: NombreIcono }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{trazos[nombre]}</svg>;
}
