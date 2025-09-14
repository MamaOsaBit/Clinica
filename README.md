# Clinica

Proyecto Express + Prisma para gestionar usuarios (ADMIN, DOCTOR, PACIENTE), creación de horas médicas y reservas por pacientes.

Este README contiene lo necesario para instalar, ejecutar y probar la aplicación en local, además de ejemplos de uso para las rutas más importantes.

## Requisitos

- Node.js v18+ (recomendado) o la versión que uses localmente
- npm
- Base de datos configurada (sqlite, Postgres u otra según `prisma/schema.prisma`)

## Instalación

1. Instala dependencias:

```bash
npm install
```

2. Si cambias el esquema Prisma, crea y aplica migraciones y regenera el cliente:

```bash
npx prisma migrate dev --name <descripcion>
npx prisma generate
```

> Nota: el proyecto incluye cliente Prisma generado en `generated/prisma`. Si editas `prisma/schema.prisma`, asegúrate de ejecutar los comandos anteriores localmente.

## Ejecutar en desarrollo

```bash
npm run dev
# o
node src/server.js
```

La aplicación expone vistas estáticas y API REST en `http://localhost:3000` por defecto (ver `src/server.js`).

## Estructura importante

- `src/app.js` — configuración de Express, middleware y mount de rutas.
- `src/server.js` — arranque del servidor.
- `src/controllers/` — controladores por recurso.
- `src/routes/` — rutas (register, login, medico, admin, index).
- `src/public/js/` — scripts cliente que consumen las APIs.
- `src/views/` — páginas HTML estáticas.
- `prisma/` — esquema y migraciones.
- `generated/prisma` — cliente Prisma generado (incluido en repo).

## Rutas y API (resumen)

Web (vistas):
- GET /register — formulario de registro (envía POST a /register)
- GET /login — formulario de login
- GET /medico/panel?doctorId=<id> — panel del doctor
- GET /paciente/solicitar-hora?pacienteId=<id> — UI paciente

API (JSON):
- POST /api/register — Crear usuario. Body JSON: { nombre, email, clave, rol }
- POST /api/login — Login. Body JSON: { email, clave }
- GET /api/medico/horas?doctorId=<id> — Listado de horas (libres y tomadas) del doctor
- GET /api/horas/libres — Listado de horas libres (para pacientes)
- POST /api/paciente/tomar-hora — Reservar hora. Body JSON: { pacienteId, horaMedicaId }
- GET /admin/horas — (admin) listar horas médicas
- POST /admin/horas — (admin) crear hora

## Uso rápido (Postman / curl)

- Crear usuario (POST JSON):

```bash
curl -X POST http://localhost:3000/api/register \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Ana","email":"ana@example.com","clave":"pass123","rol":"PACIENTE"}'
```

- Login (POST JSON):

```bash
curl -X POST http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ana@example.com","clave":"pass123"}'
```

- Listar horas libres:

```bash
curl http://localhost:3000/api/horas/libres
```

- Tomar hora (POST JSON):

```bash
curl -X POST http://localhost:3000/api/paciente/tomar-hora \
  -H 'Content-Type: application/json' \
  -d '{"pacienteId":1,"horaMedicaId":10}'
```

## Notas de seguridad y próximos pasos

- Actualmente la app usa query params para identificar a doctor/paciente en las vistas (p.ej. `?doctorId=1`) — reemplazar por sesiones/JWT es necesario para producción.
- Añadir validación y sanitización de inputs, límites y pruebas automatizadas.

## Preguntas frecuentes

- ¿Dónde está la documentación? — Está en `DOCUMENTATION.md` (más detalle) y en este `README.md`.
- ¿Necesito regenerar Prisma? — Sí si cambias `prisma/schema.prisma`.

