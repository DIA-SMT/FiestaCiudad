-- ===========================================================================
-- Fiesta de la Ciudad - San Miguel de Tucuman
-- Tabla de preinscripciones + indices + RLS
-- Ejecutar en Supabase > SQL Editor (o con `supabase db push`).
-- ===========================================================================

-- gen_random_uuid() viene de pgcrypto (ya habilitada en proyectos Supabase).
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tabla
-- ---------------------------------------------------------------------------
create table if not exists public.preinscripciones (
  id                  uuid        primary key default gen_random_uuid(),
  nombre_completo     text        not null,
  telefono            text        not null,
  mail                text        not null,
  direccion           text        not null,
  codigo_verificacion text        not null,
  estado              text        not null default 'confirmado',
  creado_en           timestamptz not null default now(),

  constraint preinscripciones_codigo_verificacion_key unique (codigo_verificacion),

  -- Validaciones de integridad (espejo de la validacion del servidor).
  constraint preinscripciones_nombre_no_vacio  check (char_length(btrim(nombre_completo)) between 3 and 120),
  constraint preinscripciones_telefono_formato check (telefono ~ '^[0-9+ ]{6,30}$'),
  constraint preinscripciones_mail_formato     check (mail ~ '^[^[:space:]@]+@[^[:space:]@]+\.[A-Za-z]{2,}$'),
  constraint preinscripciones_direccion_largo  check (char_length(btrim(direccion)) between 5 and 200),
  constraint preinscripciones_codigo_formato   check (codigo_verificacion ~ '^[A-Za-z0-9_-]{22,64}$'),
  constraint preinscripciones_estado_valido    check (estado in ('confirmado', 'anulado'))
);

comment on table  public.preinscripciones is 'Preinscripciones a la Fiesta de la Ciudad de San Miguel de Tucuman.';
comment on column public.preinscripciones.codigo_verificacion is 'Token aleatorio no adivinable (32 bytes, base64url). Es el contenido del QR.';
comment on column public.preinscripciones.estado is 'confirmado | anulado. Solo "confirmado" habilita el ingreso.';

-- ---------------------------------------------------------------------------
-- Indices
-- ---------------------------------------------------------------------------

-- Un mail = una preinscripcion. Case-insensitive para que no entren duplicados
-- por diferencias de mayusculas (la app igual normaliza a minusculas).
create unique index if not exists preinscripciones_mail_unico
  on public.preinscripciones (lower(mail));

-- Busqueda por codigo al escanear el QR (la restriccion unique ya crea indice,
-- se declara explicito el de fecha para listados administrativos).
create index if not exists preinscripciones_creado_en_idx
  on public.preinscripciones (creado_en desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Sin politicas de lectura la tabla queda ilegible para anon y authenticated.
-- El rol postgres (panel de Supabase, Table Editor) sigue viendo los registros
-- para tareas administrativas.
alter table public.preinscripciones enable row level security;

-- Se parte de cero: nadie tiene permisos salvo lo que se otorgue abajo.
revoke all on table public.preinscripciones from anon, authenticated;

-- El rol anonimo solo puede INSERTAR, y solo estas columnas.
-- No puede tocar id, estado ni creado_en: quedan en sus valores por defecto.
grant insert (nombre_completo, telefono, mail, direccion, codigo_verificacion)
  on table public.preinscripciones to anon;

-- Lectura para la verificacion del QR: solo el backend, con la service role key.
grant select on table public.preinscripciones to service_role;

drop policy if exists "anon puede preinscribirse" on public.preinscripciones;
create policy "anon puede preinscribirse"
  on public.preinscripciones
  for insert
  to anon
  with check (estado = 'confirmado');

-- No existe ninguna politica de SELECT / UPDATE / DELETE: la tabla es
-- ilegible para anon y authenticated. La verificacion del QR se resuelve en el
-- servidor con la service role key, que por diseno omite RLS.

-- ---------------------------------------------------------------------------
-- Verificacion rapida (opcional, solo lectura)
-- ---------------------------------------------------------------------------
-- select tablename, rowsecurity from pg_tables where tablename = 'preinscripciones';
-- select policyname, cmd, roles from pg_policies where tablename = 'preinscripciones';
