import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import "./landing-fiesta.css";

export const metadata: Metadata = {
  title: "Fiesta de la Ciudad — San Miguel de Tucumán",
  description:
    "Preinscripción a la Fiesta de la Ciudad de San Miguel de Tucumán. Cargá tus datos y recibí tu comprobante con código QR.",
  applicationName: "Fiesta de la Ciudad SMT",
};

export const viewport: Viewport = {
  themeColor: "#126ff5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
