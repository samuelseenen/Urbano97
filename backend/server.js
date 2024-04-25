const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const loginRoutes = require('./routes/login');
const bookingRoutes = require('./routes/booking'); // Importa las rutas de booking
const reservationRoutes = require('./routes/reservation'); // Importa las nuevas rutas de reserva

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

// Definir rutas de autenticación
app.use('/login', loginRoutes);

// Definir rutas de booking
app.use('/booking', bookingRoutes);

// Definir rutas de reserva
app.use('/reserva', reservationRoutes(connection)); // Pasar la conexión como argumento

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
