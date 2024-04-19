const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const loginRoutes = require('./routes/login');
const bookingRoutes = require('./routes/booking'); // Importa las nuevas rutas de booking

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
app.use('/booking', bookingRoutes); // Agrega las nuevas rutas de booking

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
