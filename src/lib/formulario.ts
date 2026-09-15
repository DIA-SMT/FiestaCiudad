import type { CamposPreinscripcion, ErroresPreinscripcion } from "@/lib/validacion";

/**
 * Campo trampa para bots: va oculto en el formulario y una persona nunca lo
 * completa. Si llega con contenido, el envio se descarta.
 */
export const CAMPO_TRAMPA = "sitio_web";

/** Casilla obligatoria de consentimiento de datos personales. */
export const CAMPO_CONSENTIMIENTO = "consentimiento";

/**
 * Casilla donde escribir para ejercer los derechos de acceso, rectificacion y
 * supresion (Ley 25.326). CAMBIAR por la casilla institucional real.
 */
export const CONTACTO_DATOS = "privacidad@smt.gob.ar";

/** Dias que se conservan los datos despues del evento. */
export const DIAS_RETENCION = 90;

/** Dias que dura la cookie del comprobante en el navegador. */
export const DIAS_COOKIE_COMPROBANTE = 15;

/** Nombre de la cookie que permite recuperar el comprobante en el mismo navegador. */
export const COOKIE_COMPROBANTE = "comprobante_fiesta";

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
