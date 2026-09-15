import type { CamposPreinscripcion, ErroresPreinscripcion } from "@/lib/validacion";

/**
 * Campo trampa para bots: va oculto en el formulario y una persona nunca lo
 * completa. Si llega con contenido, el envio se descarta.
 */
export const CAMPO_TRAMPA = "sitio_web";

/** Estado que el server action devuelve al formulario. */
export type EstadoFormulario = {
  errores: ErroresPreinscripcion;
  /** Valores ya normalizados, para no perder lo cargado si hay un error. */
  valores: CamposPreinscripcion;
  /** Aviso general (duplicado, error inesperado). */
  mensaje: string | null;
  /** Estilo del aviso general. */
  tono: "advertencia" | "error" | null;
};

export const ESTADO_INICIAL: EstadoFormulario = {
  errores: {},
  valores: { nombre_completo: "", telefono: "", mail: "", direccion: "" },
  mensaje: null,
  tono: null,
};
