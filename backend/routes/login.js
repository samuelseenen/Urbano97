const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'urbano97'
});

// Ruta para manejar las solicitudes de inicio de sesión
router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Consulta SQL para verificar las credenciales
  const query = 'SELECT * FROM clientes WHERE Email = ? AND Contrasenya = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      // Credenciales inválidas
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      // Credenciales válidas
      res.status(200).json({ message: 'Login successful' });
    }
  });
});

module.exports = router;
