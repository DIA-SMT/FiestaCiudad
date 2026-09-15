# Fiesta de la Ciudad — San Miguel de Tucumán

Landing de preinscripción con comprobante en código QR y verificación en el ingreso.
Next.js (App Router) + Tailwind + Supabase, desplegable en Vercel.

## Pantallas

| Ruta | Qué hace |
| --- | --- |
| `/` | Hero institucional y formulario de preinscripción (nombre completo, teléfono, mail, dirección). |
| `/confirmacion/[codigo]` | Comprobante: QR descargable en PNG y enlace para compartir. |
| `/verificar/[codigo]` | Lo que se ve al escanear el QR. Verde si la preinscripción es válida, rojo si el código no existe. |

## 1. Crear el proyecto en Supabase

1. Entrá a [supabase.com/dashboard](https://supabase.com/dashboard) y creá un proyecto nuevo
   (región sugerida: `South America (São Paulo)`).
2. Guardá la contraseña de la base de datos que te pide al crearlo.
3. En **Project Settings → API** vas a encontrar los tres valores que necesitás:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (secreta) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Correr la migración

1. Abrí **SQL Editor → New query** en el panel de Supabase.
2. Pegá el contenido de [`supabase/migration.sql`](supabase/migration.sql) y ejecutá **Run**.

La migración crea la tabla `preinscripciones`, el índice único por mail
(case-insensitive) y las políticas de RLS:

- el rol `anon` **solo puede insertar**, y solo las cuatro columnas del formulario
  más el código de verificación;
- **no hay política de lectura**: la tabla es ilegible desde el navegador;
- la verificación del QR se resuelve en el servidor con la *service role key*,
  que por diseño omite RLS.

También se puede aplicar con la CLI:

```bash
supabase db push
```

## 2 bis. Endurecimiento antes de abrir al público

Antes de publicar el formulario, ejecutá también
[`supabase/migration-002-endurecimiento.sql`](supabase/migration-002-endurecimiento.sql)
en **SQL Editor**. Hace dos cosas:

- **Le saca a `service_role` el permiso de modificar o borrar el padrón.** La app solo
  lee con esa clave, así que no se rompe nada, y una clave filtrada ya no puede vaciar
  la tabla. El rol `postgres` (Table Editor del panel) conserva el acceso completo.
- **Crea `intentos_preinscripcion`**, que sostiene el límite por IP.

Mientras no la corras, la app funciona igual: el limitador está hecho para **fallar
abierto**, es decir, si no puede consultar la tabla deja pasar la preinscripción.
Preferimos un límite que no frena antes que una landing que no deja anotarse.

### Límite por IP

Por defecto **8 preinscripciones por hora y 30 por día** desde una misma IP. Son
generosos porque en una oficina o en el wifi municipal mucha gente comparte IP. Se
cambian en [`src/lib/limites.ts`](src/lib/limites.ts). Las IP se guardan hasheadas con
HMAC, nunca en claro, y los intentos se purgan solos a las 48 h.

El formulario incluye además un campo trampa oculto: si llega completo, el envío se
descarta sin tocar la base.

### Respaldo del padrón

```bash
npm run respaldo
```

Deja un CSV en `respaldos/`, carpeta ignorada por git porque contiene datos
personales. **Corrélo antes de abrir la preinscripción y una vez por día mientras
esté abierta**, y guardá una copia fuera de la máquina: el plan Free de Supabase no
tiene restauración a un punto en el tiempo.

## 3. Configurar las variables de entorno

```bash
cp .env.example .env.local
```

Completá `.env.local` con los valores del paso 1.

| Variable | Dónde se usa | Secreta |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Servidor | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Servidor (inserción con RLS) | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Servidor (verificación del QR) | **Sí** |
| `NEXT_PUBLIC_SITE_URL` | Arma la URL absoluta del QR | No |

`NEXT_PUBLIC_SITE_URL` es opcional: si no está definida, la URL se deduce del host
del pedido (o de `VERCEL_URL`). Conviene fijarla en producción con el dominio
definitivo y sin barra final, para que los QR ya emitidos no dependan del host por
el que se accedió.

## 4. Correr en local

```bash
npm install
npm run dev
```

La app queda en `http://localhost:3000`.

## 5. Desplegar en Vercel

1. Subí el repositorio a GitHub/GitLab e importalo desde
   [vercel.com/new](https://vercel.com/new). Vercel detecta Next.js solo.
2. En **Settings → Environment Variables** cargá las cuatro variables para
   *Production* y *Preview*. `SUPABASE_SERVICE_ROLE_KEY` va **sin** el prefijo
   `NEXT_PUBLIC_`: nunca llega al navegador.
3. **Deploy**. Cuando asignes el dominio definitivo, actualizá `NEXT_PUBLIC_SITE_URL`
   y volvé a desplegar.

## Logo institucional

Copiá el logo en blanco a `public/logo-smt-blanco.png`. Hasta entonces el espacio
queda reservado en el hero y la maqueta funciona igual.

## Notas de seguridad

- El `codigo_verificacion` son 32 bytes aleatorios (`crypto.randomBytes`) en base64url:
  no es adivinable ni enumerable.
- La pantalla de verificación muestra únicamente nombre completo y fecha de
  preinscripción. Teléfono, mail y dirección no salen nunca del servidor.
- Si el mail ya está preinscripto, el formulario avisa sin revelar ningún dato de
  la otra persona.
- `/confirmacion` y `/verificar` se sirven con `noindex`.
