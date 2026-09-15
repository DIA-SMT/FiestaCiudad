"use client";

import { useActionState, useId, useState, type FormEvent } from "react";

import { preinscribir } from "@/app/acciones";
import {
  CAMPO_CONSENTIMIENTO,
  CAMPO_TRAMPA,
  CONTACTO_DATOS,
  DIAS_RETENCION,
  ESTADO_INICIAL,
} from "@/lib/formulario";
import { Icono } from "@/components/identidad-fiesta";
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
    etiqueta: "Correo electrónico",
    tipo: "email",
    autoComplete: "email",
    placeholder: "nombre@correo.com",
    inputMode: "email",
    ayuda: "Revisalo: identifica tu preinscripción.",
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
  const [acepta, setAcepta] = useState(false);
  const [errorConsentimiento, setErrorConsentimiento] = useState<string | undefined>();

  const idConsentimiento = `${idBase}-consentimiento`;
  const idErrorConsentimiento = `${idBase}-consentimiento-error`;

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

    // El consentimiento es obligatorio: sin el no se manda nada al servidor.
    if (!acepta) {
      evento.preventDefault();
      setErrorConsentimiento("Para preinscribirte necesitamos que aceptes el uso de tus datos.");
      document.getElementById(idConsentimiento)?.focus();
      return;
    }

    setEditados({});
  }

  const avisoGeneral = estado.mensaje;
  const esAdvertencia = estado.tono === "advertencia";
  const validacionActual = validarPreinscripcion(valores);
  const completos = CAMPOS.filter((campo) => !validacionActual[campo.nombre]).length;
  const iconos = { nombre_completo: "persona", telefono: "telefono", mail: "mail", direccion: "ubicacion" } as const;

  return (
    <form action={accion} onSubmit={alEnviar} noValidate className="formulario-fiesta" aria-busy={pendiente}>
      {/* Trampa para bots: invisible y fuera del recorrido de teclado y de lectores de pantalla. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={CAMPO_TRAMPA}>No completes este campo</label>
        <input id={CAMPO_TRAMPA} name={CAMPO_TRAMPA} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="progreso-formulario">
        <span>{completos === 4 ? "Todo listo para confirmar" : "Tu lugar empieza acá"} · {completos}/4</span>
        <div className="progreso-barras" aria-hidden="true">{CAMPOS.map((campo, i) => <span key={campo.nombre} className={i < completos ? "completo" : ""} />)}</div>
      </div>
      {avisoGeneral ? (
        <p
          role="alert"
          className={`mb-5 rounded-xl border px-4 py-3 text-sm font-bold ${
            esAdvertencia
              ? "border-smt-ambar bg-[#fffbeb] text-[#8a5a00]"
              : "border-smt-rojo bg-[#fef5f5] text-smt-rojo"
          }`}
        >
          {avisoGeneral}
        </p>
      ) : null}

      <div className="campos-fiesta">
      {CAMPOS.map((campo) => {
        const error = errorDe(campo.nombre);
        const descritoPor = [campo.ayuda ? idAyuda(campo.nombre) : null, error ? idError(campo.nombre) : null]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={campo.nombre} className={campo.nombre === "nombre_completo" || campo.nombre === "direccion" ? "campo-ancho" : ""}>
            <label className="etiqueta" htmlFor={idCampo(campo.nombre)}>
              {campo.etiqueta}
            </label>
            <div className="contenedor-campo">
            <Icono nombre={iconos[campo.nombre]} className="icono-campo" />
            <input
              id={idCampo(campo.nombre)}
              name={campo.nombre}
              type={campo.tipo}
              inputMode={campo.inputMode}
              autoComplete={campo.autoComplete}
              placeholder={campo.placeholder}
              maxLength={campo.maxLength}
              required
              readOnly={pendiente}
              value={valores[campo.nombre]}
              onChange={(evento) => alCambiar(campo.nombre, evento.target.value)}
              onBlur={() => alSalir(campo.nombre)}
              aria-invalid={error ? true : undefined}
              aria-describedby={descritoPor || undefined}
              className={`campo ${error ? "campo-invalido" : ""}`}
            />
            {tocados[campo.nombre] && !validacionActual[campo.nombre] && !error ? <Icono nombre="check" className="check-campo" /> : null}
            </div>
            {campo.ayuda ? (
              <p id={idAyuda(campo.nombre)} className="ayuda">
                {campo.ayuda}
              </p>
            ) : null}
            {error ? (
              <p id={idError(campo.nombre)} className="mensaje-error" aria-live="polite">
                <span aria-hidden="true">•</span>
                <span>{error}</span>
              </p>
            ) : null}
          </div>
        );
      })}
      </div>

      <div className="mt-5 rounded-xl border border-smt-linea bg-[#f7faff] p-4">
        <details className="text-sm leading-relaxed text-smt-texto">
          <summary className="cursor-pointer font-bold text-smt-tinta">
            Cómo usamos y protegemos tus datos
          </summary>
          <div className="mt-3 space-y-2">
            <p>
              <strong>Responsable:</strong> Municipalidad de San Miguel de Tucumán.
            </p>
            <p>
              <strong>Qué guardamos:</strong> nombre completo, teléfono, mail y dirección.
            </p>
            <p>
              <strong>Para qué:</strong> organizar y verificar tu ingreso a la Fiesta de la
              Ciudad. No se usan para ninguna otra finalidad ni se comparten con terceros.
            </p>
            <p>
              <strong>Cómo los protegemos:</strong> viajan cifrados, se guardan en una base que no
              es accesible desde el navegador, y tu comprobante se valida con un código aleatorio
              que no se puede adivinar. En la pantalla de verificación del ingreso solo se muestran
              tu nombre y la fecha: nunca tu teléfono, tu mail ni tu dirección.
            </p>
            <p>
              <strong>Cuánto tiempo:</strong> se eliminan a los {DIAS_RETENCION} días de realizado
              el evento.
            </p>
            <p>
              <strong>Tus derechos:</strong> podés pedir acceder, rectificar o suprimir tus datos
              escribiendo a{" "}
              <a className="font-bold text-smt-azul underline" href={"mailto:" + CONTACTO_DATOS}>
                {CONTACTO_DATOS}
              </a>
              . Ley 25.326 de Protección de Datos Personales. La autoridad de control es la
              Agencia de Acceso a la Información Pública.
            </p>
          </div>
        </details>

        <label htmlFor={idConsentimiento} className="mt-4 flex items-start gap-3 text-sm font-bold text-smt-tinta">
          <input
            id={idConsentimiento}
            name={CAMPO_CONSENTIMIENTO}
            type="checkbox"
            checked={acepta}
            onChange={(evento) => {
              setAcepta(evento.target.checked);
              if (evento.target.checked) setErrorConsentimiento(undefined);
            }}
            aria-invalid={errorConsentimiento ? true : undefined}
            aria-describedby={errorConsentimiento ? idErrorConsentimiento : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-smt-azul"
          />
          <span>Acepto que la Municipalidad use estos datos para organizar mi ingreso al evento.</span>
        </label>
        {errorConsentimiento ? (
          <p id={idErrorConsentimiento} className="mensaje-error">
            <span aria-hidden="true">•</span>
            <span>{errorConsentimiento}</span>
          </p>
        ) : null}
      </div>

      <div className="formulario-enviar">
        <button type="submit" className="boton-fiesta" disabled={pendiente}>
          {pendiente ? <><span className="spinner-fiesta" aria-hidden="true" /> Generando tu comprobante…</> : <>Confirmar mi preinscripción <Icono nombre="flecha" /></>}
        </button>
        <p role="status">
          {pendiente ? "Estamos procesando tu preinscripción." : "Tu comprobante con QR aparecerá en la siguiente pantalla."}
        </p>
      </div>
      <p className="privacidad-formulario"><Icono nombre="escudo" /> Tus datos se usan para organizar el ingreso al evento.</p>
    </form>
  );
}
