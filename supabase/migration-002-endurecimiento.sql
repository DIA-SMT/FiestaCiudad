-- ===========================================================================
-- Fiesta de la Ciudad - San Miguel de Tucuman
-- Migracion 002: endurecimiento previo a la apertura al publico
-- Ejecutar en Supabase > SQL Editor DESPUES de migration.sql
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Quitarle a service_role el poder de modificar o borrar el padron
-- ---------------------------------------------------------------------------
-- La migracion original otorgaba SELECT a service_role, pero ese rol conserva
-- ademas los privilegios por defecto de Supabase: podia UPDATE y DELETE sobre
-- toda la tabla. La app nunca los usa (solo hace .select() en
-- src/lib/preinscripciones.ts), asi que revocarlos no rompe nada y evita que
-- una clave filtrada o un error borren el padron entero.
--
-- El rol postgres (Table Editor y SQL Editor del panel) NO se toca: segui
-- administrando los registros desde ahi con normalidad.
revoke insert, update, delete, truncate
  on table public.preinscripciones from service_role;

-- ---------------------------------------------------------------------------
-- 2. Tabla de intentos, para limitar la carga masiva por IP
-- ---------------------------------------------------------------------------
-- Guarda un hash de la IP, nunca la IP en claro: no es dato personal
-- reidentificable y alcanza para contar intentos en una ventana de tiempo.
create table if not exists public.intentos_preinscripcion (
  id        uuid        primary key default gen_random_uuid(),
  ip_hash   text        not null,
  creado_en timestamptz not null default now(),

  constraint intentos_ip_hash_formato check (ip_hash ~ '^[a-f0-9]{64}$')
);

comment on table public.intentos_preinscripcion is
  'Intentos de preinscripcion por IP (hasheada) para limitar carga masiva. Se purga sola a las 48 h.';

-- Indice que sostiene la consulta del limitador: intentos de una IP en una ventana.
create index if not exists intentos_ip_ventana_idx
  on public.intentos_preinscripcion (ip_hash, creado_en desc);

-- Indice para la purga por antiguedad.
create index if not exists intentos_creado_en_idx
  on public.intentos_preinscripcion (creado_en);

-- ---------------------------------------------------------------------------
-- 3. Permisos de la tabla de intentos
-- ---------------------------------------------------------------------------
-- El navegador no la toca nunca: solo el servidor, con la service role key.
alter table public.intentos_preinscripcion enable row level security;

revoke all on table public.intentos_preinscripcion from anon, authenticated;

-- service_role necesita escribir y purgar aca (a diferencia del padron).
grant select, insert, delete on table public.intentos_preinscripcion to service_role;

-- ---------------------------------------------------------------------------
-- Verificacion (opcional, solo lectura)
-- ---------------------------------------------------------------------------
-- Deberia devolver solo "SELECT" para service_role sobre preinscripciones:
-- select privilege_type from information_schema.role_table_grants
--  where grantee = 'service_role' and table_name = 'preinscripciones';
