import Image from "next/image";
import AvisoComprobante from "@/components/aviso-comprobante";
import FormularioPreinscripcion from "@/components/formulario-preinscripcion";
import { AnimacionesLanding } from "@/components/animaciones-landing";
import { Icono } from "@/components/identidad-fiesta";

const PREGUNTAS = [
  {
    pregunta: "¿Cuándo y dónde es la fiesta?",
    respuesta:
      "La fecha y la sede se anunciarán por los canales oficiales de la Municipalidad de San Miguel de Tucumán. Podés completar tu preinscripción desde ahora.",
  },
  {
    pregunta: "¿Cómo recibo y uso mi QR?",
    respuesta:
      "Al confirmar, tu comprobante con QR aparece en pantalla. Descargalo y presentalo al ingresar para validar tu preinscripción. Es personal: no lo compartas con otras personas.",
  },
  {
    pregunta: "¿Puedo inscribir a varias personas con el mismo correo?",
    respuesta:
      "Cada correo electrónico identifica una única preinscripción. Para registrar a otra persona, necesitás usar un correo diferente.",
  },
];

export default function PaginaPrincipal() {
  return (
    <div className="fiesta-landing landing-inscripcion">
      <AnimacionesLanding />
      <a href="#preinscripcion" className="saltar-contenido">
        Ir al formulario de preinscripción
      </a>

      <header className="encabezado-institucional">
        <div className="cabecera-fiesta">
        <a href="#inicio" className="marca-fiesta" aria-label="Fiesta de la Ciudad, inicio">
          <Image
            src="/logo-smt-blanco.png"
            alt="Ciudad San Miguel de Tucumán"
            width={507}
            height={206}
            priority
            className="logo-ciudad-oficial"
          />
        </a>
        <span className="cabecera-inscripcion">
          <Icono nombre="ticket" /> Fiesta de la Ciudad
        </span>
        <a href="#preinscripcion" className="boton-fiesta boton-nav">
          Inscribirme <Icono nombre="flecha" />
        </a>
        </div>
      </header>

      <main id="inicio">
        <section className="portada-inscripcion" aria-labelledby="titulo-fiesta">
          <div className="presentacion-inscripcion">
            <p className="sobre-titulo entrada-hero">
              <span className="punto-vivo" /> PREINSCRIPCIÓN GRATUITA Y PERSONAL
            </p>
            <h1 id="titulo-fiesta" className="titulo-fiesta">
              <span className="linea-titulo"><span>La ciudad</span></span>
              <span className="linea-titulo"><span>está de</span></span>
              <span className="linea-titulo">
                <span className="palabra-fiesta">
                  fiesta<span className="punto-acento">.</span>
                  <svg viewBox="0 0 380 24" aria-hidden="true">
                    <path d="M5 15 Q175 -3 372 12 M40 22 Q220 6 330 19" />
                  </svg>
                </span>
              </span>
            </h1>
            <div className="invitacion-inscripcion entrada-hero">
              <h2>Y vos sos parte.</h2>
              <p>Completá tus datos y obtené tu comprobante con QR para la Fiesta de la Ciudad.</p>
            </div>
            <div className="beneficios-inscripcion entrada-hero">
              <span><Icono nombre="check" /> Gratis</span>
              <span><Icono nombre="ticket" /> QR al finalizar</span>
              <span><Icono nombre="persona" /> Personal</span>
            </div>
            <div className="recuerdo-ciudad entrada-hero" data-parallax>
              <Image
                src="/hero-lapachos.jpg"
                alt="Lapachos rosados en la avenida Mate de Luna de San Miguel de Tucumán"
                fill
                priority
                sizes="(max-width: 760px) 1px, 42vw"
                className="imagen-lapachos"
              />
              <div className="foto-velo" />
              <span>Nos encontramos en nuestra ciudad.</span>
              <Icono nombre="estrella" className="destello-recuerdo" />
            </div>
          </div>

          <section id="preinscripcion" className="tarjeta-registro entrada-hero" aria-labelledby="titulo-preinscripcion">
            <div className="registro-card-top">
              <span>FIESTA DE LA CIUDAD</span>
              <span><span className="punto-vivo" /> GRATUITA</span>
            </div>
            <h2 id="titulo-preinscripcion">Preinscribite acá.</h2>
            <p className="registro-intro">
              Completá los cuatro campos y guardá tu QR.<br />
              Todos los datos son obligatorios.
            </p>
            <AvisoComprobante />
            <FormularioPreinscripcion />
          </section>
        </section>

        <div className="informacion-inscripcion" data-reveal>
          <div>
            <span className="icono-fecha"><Icono nombre="calendario" /></span>
            <p><strong>Fecha y lugar: próximamente</strong><span>Se anunciarán por los canales oficiales del municipio.</span></p>
          </div>
          <div>
            <span className="icono-fecha"><Icono nombre="ticket" /></span>
            <p><strong>Al terminar, guardá tu comprobante</strong><span>Presentá tu QR en el ingreso para validar tu preinscripción.</span></p>
          </div>
        </div>

        <section id="preguntas" className="seccion-fiesta seccion-preguntas" aria-labelledby="titulo-preguntas">
          <div data-reveal>
            <p className="sobre-titulo">TE AYUDAMOS A INSCRIBIRTE</p>
            <h2 id="titulo-preguntas">¿Alguna duda?</h2>
            <p>Lo que necesitás saber sobre tu preinscripción.</p>
          </div>
          <div className="preguntas-lista" data-reveal>
            {PREGUNTAS.map((item) => (
              <details key={item.pregunta}>
                <summary>{item.pregunta}<span aria-hidden="true">+</span></summary>
                <div className="respuesta-pregunta"><p>{item.respuesta}</p></div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer-inscripcion">
        <div className="organismo-institucional">
          <Image src="/logo-muni-iso.png" alt="" width={235} height={235} className="logo-municipal" />
          <p><strong>Municipalidad de San Miguel de Tucumán</strong><span>Fiesta de la Ciudad · Preinscripción gratuita y personal</span></p>
        </div>
        <div className="credito-desarrollo">
          <span>DESARROLLO</span>
          <Image src="/logo-ia.png" alt="Dirección de Inteligencia Artificial" width={526} height={217} className="logo-direccion-ia" />
        </div>
        <a href="#preinscripcion">Ir al formulario <Icono nombre="flecha" /></a>
      </footer>
    </div>
  );
}
