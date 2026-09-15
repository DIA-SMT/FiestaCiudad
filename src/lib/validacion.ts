export type CamposPreinscripcion = {
  nombre_completo: string;
  telefono: string;
  mail: string;
  direccion: string;
};

export type ErroresPreinscripcion = Partial<Record<keyof CamposPreinscripcion, string>>;

export const CAMPOS_VACIOS: CamposPreinscripcion = {
  nombre_completo: "",
  telefono: "",
  mail: "",
  direccion: "",
};

const RE_MAIL = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const RE_TELEFONO = /^[0-9+ ]+$/;

/** Limpia espacios sobrantes y normaliza el mail a minusculas. */
export function normalizarCampos(datos: CamposPreinscripcion): CamposPreinscripcion {
  return {
    nombre_completo: datos.nombre_completo.trim().replace(/\s+/g, " "),
    telefono: datos.telefono.trim().replace(/\s+/g, " "),
    mail: datos.mail.trim().toLowerCase(),
    direccion: datos.direccion.trim().replace(/\s+/g, " "),
  };
}

/**
 * Misma validacion en cliente y servidor.
 * Devuelve un objeto vacio cuando los datos son validos.
 */
export function validarPreinscripcion(datos: CamposPreinscripcion): ErroresPreinscripcion {
  const errores: ErroresPreinscripcion = {};
  const { nombre_completo, telefono, mail, direccion } = normalizarCampos(datos);

  if (!nombre_completo) {
    errores.nombre_completo = "Ingresá tu nombre completo.";
  } else if (nombre_completo.length < 3) {
    errores.nombre_completo = "El nombre tiene que tener al menos 3 caracteres.";
  } else if (nombre_completo.length > 120) {
    errores.nombre_completo = "El nombre no puede superar los 120 caracteres.";
  }

  if (!telefono) {
    errores.telefono = "Ingresá un teléfono de contacto.";
  } else if (!RE_TELEFONO.test(telefono)) {
    errores.telefono = "El teléfono solo admite números, espacios y el signo +.";
  } else if (telefono.replace(/\D/g, "").length < 6) {
    errores.telefono = "El teléfono tiene que tener al menos 6 números.";
  } else if (telefono.length > 30) {
    errores.telefono = "El teléfono no puede superar los 30 caracteres.";
  }

  if (!mail) {
    errores.mail = "Ingresá tu mail.";
  } else if (!RE_MAIL.test(mail)) {
    errores.mail = "Escribí un mail válido, por ejemplo nombre@correo.com.";
  } else if (mail.length > 160) {
    errores.mail = "El mail no puede superar los 160 caracteres.";
  }

  if (!direccion) {
    errores.direccion = "Ingresá tu dirección.";
  } else if (direccion.length < 5) {
    errores.direccion = "La dirección tiene que tener al menos 5 caracteres.";
  } else if (direccion.length > 200) {
    errores.direccion = "La dirección no puede superar los 200 caracteres.";
  }

  return errores;
}

export function hayErrores(errores: ErroresPreinscripcion): boolean {
  return Object.keys(errores).length > 0;
}
