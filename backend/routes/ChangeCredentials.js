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

// Ruta para verificar la contraseña
router.post('/verify-password', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT Contrasenya FROM clientes WHERE Email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const user = results[0];
    const hashedPassword = user.Contrasenya;

    bcrypt.compare(password, hashedPassword, (bcryptErr, bcryptResult) => {
      if (bcryptErr) {
        console.error('Error comparing passwords:', bcryptErr);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }

      if (bcryptResult) {
        res.status(200).json({ success: true, message: 'Password verified' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    });
  });
});

// Ruta para cambiar el correo electrónico
router.post('/change-email', (req, res) => {
  const { currentEmail, newEmail } = req.body;

  const query = 'UPDATE clientes SET Email = ? WHERE Email = ?';
  connection.query(query, [newEmail, currentEmail], (err, results) => {
    if (err) {
      console.error('Error updating email:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(400).json({ success: false, message: 'No user found with the current email' });
      return;
    }

    res.status(200).json({ success: true, message: 'Email updated successfully' });
  });
});

// Ruta para cambiar la contraseña
router.post('/change-password', (req, res) => {
  const { email, newPassword } = req.body;

  bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
    if (hashErr) {
      console.error('Error hashing password:', hashErr);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    const query = 'UPDATE clientes SET Contrasenya = ? WHERE Email = ?';
    connection.query(query, [hashedPassword, email], (err, results) => {
      if (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(400).json({ success: false, message: 'No user found with the email' });
        return;
      }

      res.status(200).json({ success: true, message: 'Password updated successfully' });
    });
  });
});

module.exports = router;
