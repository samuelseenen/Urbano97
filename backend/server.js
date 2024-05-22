const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const loginRoutes = require('./routes/login');
const bookingRoutes = require('./routes/booking'); // Importa las rutas de booking
const reservationRoutes = require('./routes/reservation'); // Importa las nuevas rutas de reserva
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware para parsear JSON
app.use(express.json());

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'urbano97'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Utilizar CORS middleware
app.use(cors());

// Ruta al archivo donde se almacenará la clave
const keyFilePath = path.join(__dirname, 'encryptionKey.txt');

// Función para generar o leer la clave del archivo
function loadEncryptionKey() {
  try {
    // Intentar leer la clave del archivo
    const key = fs.readFileSync(keyFilePath, 'utf8');
    return Buffer.from(key, 'hex');
  } catch (error) {
    // Si hay un error (por ejemplo, el archivo no existe), generar una nueva clave
    const newKey = crypto.randomBytes(32);
    // Almacenar la nueva clave en el archivo
    fs.writeFileSync(keyFilePath, newKey.toString('hex'));
    return newKey;
  }
}

// Cargar la clave al iniciar el servidor
const key = loadEncryptionKey();

// Definir rutas de autenticación
app.use('/login', loginRoutes);

// Definir rutas de booking
app.use('/booking', bookingRoutes);

// Definir rutas de reserva y desencriptación
const reservationRouter = reservationRoutes(connection, key); // Pasar la clave como argumento
app.use('/reserva', reservationRouter); // Pasar la conexión como argumento
app.use('/decrypt-qr', reservationRouter); // Pasar la conexión como argumento

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
