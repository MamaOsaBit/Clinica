Clinica — Proyecto backend + front ligero

Resumen rápido

Proyecto Express + Prisma para gestionar usuarios (roles ADMIN/DOCTOR/PACIENTE), horas médicas y reservas.

Estructura clave

- src/
  - app.js — configuración de Express, middleware y mount de rutas.
  - server.js — arranque del servidor.
  - controllers/ — lógica de negocio por recurso (admin, register, login, medico, ...)
  - routes/ — definición de rutas (register.js, login.js, medico.js, admin.js, index.js)
  - public/js/ — scripts cliente utilizados por las vistas estáticas (medicoPanel.js, solicitarHora.js)
  - views/ — páginas HTML estáticas servidas con res.sendFile (register.html, login.html, medicoPanel.html, solicitarHora.html)
  - prisma/ — esquema y migraciones

Dependencias principales

- express
- prisma
- @prisma/client (generado en `generated/prisma`)
- bcrypt
- nodemon (dev)

Cómo ejecutar (desarrollo)

1) Instala dependencias:

```bash
npm install
```

2) Asegúrate de tener la base de datos configurada (ver `prisma/schema.prisma`) y ejecutar migraciones si hiciste cambios:

```bash
npx prisma migrate dev --name <descripcion>
npx prisma generate
```

3) Levanta la app en desarrollo:

```bash
npm run dev
# o
node src/server.js
```

Notas importantes

- El cliente de Prisma está en `generated/prisma` (el proyecto incluye los ficheros generados). Si editas `prisma/schema.prisma` debes ejecutar `prisma migrate` y `prisma generate` localmente.
- La autenticación actual es básica (no hay sesiones persistentes ni JWT por defecto). Las páginas usan query params (ej. `?doctorId=...`) para identificar actor; en producción debes reemplazar esto por un sistema de sesiones/JWT y middleware de autorización.

Rutas y endpoints importantes

Web (vistas):
- GET /register — formulario HTML para crear usuario (envía POST a /register o /api/register según form)
- GET /login — formulario HTML para login
- GET /medico/panel?doctorId=<id> — panel del doctor (carga via JS)
- GET /paciente/solicitar-hora?pacienteId=<id> — UI paciente para seleccionar hora

API (JSON, apto para Postman):
- POST /api/register — crea usuario (JSON body: { nombre, email, clave, rol })
- POST /api/login — autenticación (JSON body: { email, clave }) → devuelve redirect según rol o JSON

- GET /api/medico/horas?doctorId=<id> — devuelve { horasLibres, horasTomadas }
- GET /api/horas/libres — devuelve lista de `HoraMedica` sin paciente (para pacientes)
- POST /api/paciente/tomar-hora — reserva hora: body { pacienteId, horaMedicaId }

- GET /admin/horas — (admin) listar horas médicas
- POST /admin/horas — (admin) crear hora (body: { start, end })

Servicios y lógica relevante

- `src/controllers/registerController.js` — validación, hash de contraseña (bcrypt) y creación de usuario.
- `src/controllers/loginController.js` — verificación credenciales y redirección por rol.
- `src/controllers/medicoController.js` — API para listar horas, crear horas, y tomar horas (pacientes).
- `src/services/*` — capas de abstracción hacia Prisma (revisa `src/services` para lógica compartida).

Buenas prácticas y siguientes pasos recomendados

- Implementar sesiones o JWT y middleware de autorización en `src/middlewares/`.
- Añadir validaciones más estrictas y sanitización de entrada.
- Tests unitarios/integ (mocha/jest + supertest) para endpoints críticos.
- Limpiar rutas/archivos legacy si lo deseas (hay archivos renombrados durante refactor).