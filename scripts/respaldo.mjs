/**
 * Respaldo del padron de preinscripciones a CSV.
 *
 *   npm run respaldo
 *
 * Lee las credenciales de .env.local (o del entorno, para correrlo en un cron).
 * Guarda en respaldos/preinscripciones-<fecha>.csv, carpeta ignorada por git:
 * el archivo tiene datos personales y NUNCA debe subirse al repositorio.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const PAGINA = 1000;

function cargarEntorno() {
  if (existsSync(".env.local")) {
    for (const linea of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const corte = linea.indexOf("=");
      if (corte < 1 || linea.trimStart().startsWith("#")) continue;
      const clave = linea.slice(0, corte).trim();
      if (!process.env[clave]) process.env[clave] = linea.slice(corte + 1).trim();
    }
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) {
    console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }
  return { url: url.replace(/\/+$/, ""), clave };
}

/** Escapa un valor para CSV segun RFC 4180. */
function celda(valor) {
  const texto = valor === null || valor === undefined ? "" : String(valor);
  return /[",\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

function selloDeTiempo() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

async function principal() {
  const { url, clave } = cargarEntorno();
  const cabeceras = { apikey: clave, Authorization: `Bearer ${clave}` };
  const columnas = [
    "id",
    "nombre_completo",
    "telefono",
    "mail",
    "direccion",
    "codigo_verificacion",
    "estado",
    "creado_en",
  ];

  const filas = [];
  for (let desde = 0; ; desde += PAGINA) {
    const respuesta = await fetch(
      `${url}/rest/v1/preinscripciones?select=${columnas.join(",")}&order=creado_en.asc`,
      { headers: { ...cabeceras, Range: `${desde}-${desde + PAGINA - 1}` } },
    );
    if (!respuesta.ok) {
      console.error(`Error ${respuesta.status} al leer la tabla:`, await respuesta.text());
      process.exit(1);
    }
    const lote = await respuesta.json();
    filas.push(...lote);
    if (lote.length < PAGINA) break;
  }

  if (!existsSync("respaldos")) mkdirSync("respaldos");
  const archivo = `respaldos/preinscripciones-${selloDeTiempo()}.csv`;
  const csv = [
    columnas.join(","),
    ...filas.map((fila) => columnas.map((c) => celda(fila[c])).join(",")),
  ].join("\r\n");

  writeFileSync(archivo, "﻿" + csv, "utf8");
  console.log(`Respaldo guardado: ${archivo}`);
  console.log(`Preinscripciones: ${filas.length}`);
  if (filas.length) {
    console.log(`Desde: ${filas[0].creado_en}`);
    console.log(`Hasta: ${filas[filas.length - 1].creado_en}`);
  }
  console.log("\nGuardá una copia fuera de esta máquina. El archivo tiene datos personales.");
}

principal();
