const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: 'dotenv.env' });

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Ruta para manejar las solicitudes de inicio de sesión
router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Consulta SQL para obtener la contraseña encriptada del usuario con el email proporcionado
  const query = 'SELECT id, Contrasenya, tipoUsuario FROM clientes WHERE Email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const user = results[0];
    const hashedPassword = user.Contrasenya;

    // Comparar la contraseña proporcionada con la contraseña encriptada almacenada
    bcrypt.compare(password, hashedPassword, (bcryptErr, bcryptResult) => {
      if (bcryptErr) {
        console.error('Error comparing passwords:', bcryptErr);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      if (bcryptResult) {
        res.status(200).json({ message: 'Login successful', userId: user.id, tipoUsuario: user.tipoUsuario });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    });
  });
});

module.exports = router;
