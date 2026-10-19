# Urbano97 · Reservas para barbería

Aplicación web para pedir cita en una barbería. Fue mi proyecto de fin de ciclo de Desarrollo de Aplicaciones Web (2024) y la hice de principio a fin: el frontend en Angular, la API en Node.js con Express y la base de datos en MySQL.

La idea es sencilla: el cliente reserva desde la web, recibe un código QR por email y, al llegar a la barbería, el personal escanea ese QR para comprobar la cita.

## Qué se puede hacer

**Como cliente**

- Crear una cuenta e iniciar sesión.
- Ver los servicios de la barbería.
- Reservar una cita: elegir el día en un calendario, el peluquero y una de sus horas libres. Las horas ya ocupadas no aparecen.
- Recibir por email un código QR con los datos de la reserva.
- Consultar mis reservas, con su estado (pendiente o terminada), y cancelarlas.
- Cambiar el email o la contraseña de la cuenta.

**En la barbería**

- Escanear con la cámara el QR que trae el cliente y ver al momento quién es, con qué peluquero tiene la cita, el día y la hora.
- Con una cuenta de administrador, ver las reservas de todos los clientes y cancelar cualquiera.

## Cómo funciona el código QR

1. Al confirmar una reserva, el servidor junta sus datos (peluquero, cliente, fecha y hora) y los cifra con AES-256.
2. Con ese texto cifrado genera un código QR y se lo envía al cliente por email con Nodemailer.
3. En la barbería, el lector de QR de la aplicación manda el contenido al servidor, que lo descifra y devuelve los datos de la cita.

Como el QR solo contiene datos cifrados, no se puede leer ni falsificar sin la clave del servidor.

## Tecnologías

| Parte | Tecnologías |
|---|---|
| Frontend | Angular 17, TypeScript, Bootstrap 5, FullCalendar, ZXing (lector de QR) |
| Backend | Node.js, Express, bcrypt, crypto (AES-256), qrcode, Nodemailer |
| Base de datos | MySQL |

Las contraseñas se guardan cifradas con bcrypt y las páginas privadas del frontend están protegidas con un guard de Angular.

## Estructura

```
backend/
  server.js            Servidor Express y conexión a MySQL
  routes/              Registro, login, disponibilidad, reservas, cancelación y cambio de credenciales
frontend/Barberia/
  src/app/             Componentes: inicio, servicios, reservar, mis reservas, lector QR, login, registro…
urbano97.sql           Estructura de la base de datos y datos de ejemplo
```

La base de datos tiene cuatro tablas: `clientes`, `peluqueros`, `horas_disponibles` y `reservas`.

## Ponerlo en marcha en local

**Requisitos:** Node.js, MySQL (por ejemplo con XAMPP) y Angular CLI (`npm install -g @angular/cli`).

1. **Base de datos:** crea una base de datos e importa `urbano97.sql`.
2. **Variables de entorno:** crea el archivo `backend/dotenv.env` con:

   ```
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=urbano97
   EMAIL_USER=cuenta_de_gmail_para_enviar_los_qr
   EMAIL_PASS=contraseña_de_aplicación_de_gmail
   ```

3. **Backend:**

   ```bash
   cd backend
   npm install
   node server.js
   ```

   La API queda en `http://localhost:3000`. La primera vez se genera automáticamente la clave de cifrado de los QR en `backend/encryptionKey.txt`.

4. **Frontend**, en otra terminal:

   ```bash
   cd frontend/Barberia
   npm install
   ng serve
   ```

   Abre `http://localhost:4200`.

## Qué mejoraría hoy

Lo hice mientras aprendía y, mirándolo ahora, cambiaría algunas cosas:

- **Sesiones con tokens (JWT) en el servidor.** Ahora la sesión solo se guarda en el frontend y la API identifica al usuario por el email que recibe, así que no protege las rutas por sí misma.
- **Un vector de inicialización (IV) aleatorio para cada QR**, en lugar de uno fijo.
- **Una única conexión a la base de datos compartida** por todas las rutas, en lugar de abrir una en cada archivo.
- **Despliegue online**, para que se pueda probar sin instalar nada.

## Autor

**Samuel Senén López** · [samuelsenen.dev](https://samuelsenen.dev) · [GitHub](https://github.com/samuelseenen)
