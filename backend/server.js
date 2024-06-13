//Se agregan los distintos modulos de node.
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
//Se agregan las rutas de los demas archivos para poder acceder a las funciones.
const loginRoutes = require('./routes/login');
const bookingRoutes = require('./routes/booking');
const reservationRoutes = require('./routes/reservation');
const registerRoutes = require('./routes/register');
const watchReservationsRoutes = require('./routes/WatchReservations');
const cancelReservationRoutes = require('./routes/CancelReservation');
const changeCredentialsRoutes = require('./routes/ChangeCredentials');
//Agrego el archivo .env para definir las variables de la bbdd.
require('dotenv').config({ path: 'dotenv.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware para parsear JSON
app.use(express.json());

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Utilizar CORS middleware para la comunicacion entre el backend y el frontend.
app.use(cors());

// Ruta al archivo donde se almacenará la clave para la desencriptacion del codigo qr.
const keyFilePath = path.join(__dirname, 'encryptionKey.txt');

// Función para generar o leer la clave del archivo
function loadEncryptionKey() {
  try {
    // Intentar leer la clave del archivo
    const key = fs.readFileSync(keyFilePath, 'utf8');
    return Buffer.from(key, 'hex');
  } catch (error) {
    // Si hay un error, generar una nueva clave
    const newKey = crypto.randomBytes(32);
    // Almacenar la nueva clave en el archivo
    fs.writeFileSync(keyFilePath, newKey.toString('hex'));
    return newKey;
  }
}

// Cargar la clave al iniciar el servidor
const key = loadEncryptionKey();

// Se definen las rutas de las funciones para que despues puedan ser llamadas en el frontend.
app.use('/login', loginRoutes);
app.use('/booking', bookingRoutes);
const reservationRouter = reservationRoutes(connection, key); // Pasar la clave como argumento
app.use('/reserva', reservationRouter);
app.use('/decrypt-qr', reservationRouter);
app.use('/register', registerRoutes);
app.use('/watch-reservations', watchReservationsRoutes);
app.use('/cancel-reservation', cancelReservationRoutes);
app.use('/change-credentials', changeCredentialsRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
