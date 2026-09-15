"use client";

import { useActionState, useId, useState, type FormEvent } from "react";

import { preinscribir } from "@/app/acciones";
import { ESTADO_INICIAL } from "@/lib/formulario";
import {
  hayErrores,
  validarPreinscripcion,
  type CamposPreinscripcion,
  type ErroresPreinscripcion,
} from "@/lib/validacion";

type NombreCampo = keyof CamposPreinscripcion;

type DefinicionCampo = {
  nombre: NombreCampo;
  etiqueta: string;
  tipo: "text" | "tel" | "email";
  autoComplete: string;
  placeholder: string;
  inputMode?: "text" | "tel" | "email";
  ayuda?: string;
  maxLength: number;
};

const CAMPOS: DefinicionCampo[] = [
  {
    nombre: "nombre_completo",
    etiqueta: "Nombre completo",
    tipo: "text",
    autoComplete: "name",
    placeholder: "Nombre y apellido",
    maxLength: 120,
  },
  {
    nombre: "telefono",
    etiqueta: "Teléfono",
    tipo: "tel",
    autoComplete: "tel",
    placeholder: "+54 381 400 0000",
    inputMode: "tel",
    ayuda: "Solo números, espacios y el signo +.",
    maxLength: 30,
  },
  {
    nombre: "mail",
    etiqueta: "Mail",
    tipo: "email",
    autoComplete: "email",
    placeholder: "nombre@correo.com",
    inputMode: "email",
    ayuda: "A este mail lo usamos para identificar tu preinscripción.",
    maxLength: 160,
  },
  {
    nombre: "direccion",
    etiqueta: "Dirección",
    tipo: "text",
    autoComplete: "street-address",
    placeholder: "Calle, número y barrio",
    maxLength: 200,
  },
];

export default function FormularioPreinscripcion() {
  const idBase = useId();
  const [estado, accion, pendiente] = useActionState(preinscribir, ESTADO_INICIAL);
  const [valores, setValores] = useState<CamposPreinscripcion>(ESTADO_INICIAL.valores);
  const [erroresCliente, setErroresCliente] = useState<ErroresPreinscripcion>({});
  const [tocados, setTocados] = useState<Partial<Record<NombreCampo, boolean>>>({});
  const [editados, setEditados] = useState<Partial<Record<NombreCampo, boolean>>>({});

  const idCampo = (campo: NombreCampo) => `${idBase}-${campo}`;
  const idError = (campo: NombreCampo) => `${idBase}-${campo}-error`;
  const idAyuda = (campo: NombreCampo) => `${idBase}-${campo}-ayuda`;

  /** El error del cliente manda; el del servidor se muestra hasta que se edita el campo. */
  function errorDe(campo: NombreCampo): string | undefined {
    if (erroresCliente[campo]) return erroresCliente[campo];
    if (!editados[campo]) return estado.errores[campo];
    return undefined;
  }

  function alCambiar(campo: NombreCampo, valor: string) {
    const nuevos = { ...valores, [campo]: valor };
    setValores(nuevos);
    setEditados((previos) => ({ ...previos, [campo]: true }));

    // Una vez que el campo fue visitado, el error se actualiza mientras se escribe.
    if (tocados[campo]) {
      const errores = validarPreinscripcion(nuevos);
      setErroresCliente((previos) => ({ ...previos, [campo]: errores[campo] }));
    }
  }

  function alSalir(campo: NombreCampo) {
    setTocados((previos) => ({ ...previos, [campo]: true }));
    const errores = validarPreinscripcion(valores);
    setErroresCliente((previos) => ({ ...previos, [campo]: errores[campo] }));
  }

  function alEnviar(evento: FormEvent<HTMLFormElement>) {
    const errores = validarPreinscripcion(valores);
    setErroresCliente(errores);
    setTocados({ nombre_completo: true, telefono: true, mail: true, direccion: true });

    if (hayErrores(errores)) {
      evento.preventDefault();
      const primero = CAMPOS.find((campo) => errores[campo.nombre]);
      if (primero) {
        document.getElementById(idCampo(primero.nombre))?.focus();
      }
      return;
    }

    setEditados({});
  }

  const avisoGeneral = estado.mensaje;
  const esAdvertencia = estado.tono === "advertencia";

  return (
    <form action={accion} onSubmit={alEnviar} noValidate className="mt-6 space-y-5">
      {avisoGeneral ? (
        <p
          role="alert"
          className={`rounded-xl border px-4 py-3 text-sm font-bold ${
            esAdvertencia
              ? "border-smt-ambar bg-[#fffbeb] text-[#8a5a00]"
              : "border-smt-rojo bg-[#fef5f5] text-smt-rojo"
          }`}
        >
          {avisoGeneral}
        </p>
      ) : null}

      {CAMPOS.map((campo) => {
        const error = errorDe(campo.nombre);
        const descritoPor = [campo.ayuda ? idAyuda(campo.nombre) : null, error ? idError(campo.nombre) : null]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={campo.nombre}>
            <label className="etiqueta" htmlFor={idCampo(campo.nombre)}>
              {campo.etiqueta}
            </label>
            <input
              id={idCampo(campo.nombre)}
              name={campo.nombre}
              type={campo.tipo}
              inputMode={campo.inputMode}
              autoComplete={campo.autoComplete}
              placeholder={campo.placeholder}
              maxLength={campo.maxLength}
              value={valores[campo.nombre]}
              onChange={(evento) => alCambiar(campo.nombre, evento.target.value)}
              onBlur={() => alSalir(campo.nombre)}
              aria-invalid={error ? true : undefined}
              aria-describedby={descritoPor || undefined}
              className={`campo ${error ? "campo-invalido" : ""}`}
            />
            {campo.ayuda ? (
              <p id={idAyuda(campo.nombre)} className="ayuda">
                {campo.ayuda}
              </p>
            ) : null}
            {error ? (
              <p id={idError(campo.nombre)} className="mensaje-error">
                <span aria-hidden="true">•</span>
                <span>{error}</span>
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="pt-1">
        <button type="submit" className="boton-primario" disabled={pendiente}>
          {pendiente ? "Enviando…" : "Confirmar preinscripción"}
        </button>
        <p className="ayuda">
          Al confirmar vas a recibir tu comprobante con código QR en pantalla.
        </p>
      </div>
    </form>
  );
}
