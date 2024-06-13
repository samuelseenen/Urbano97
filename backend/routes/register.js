const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
require('dotenv').config({ path: 'dotenv.env' }); // Cargar variables de entorno
const router = express.Router();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Ruta para registrar un nuevo cliente
router.post('/register', async (req, res) => {
  const { Nombre, Apellido, Direccion, Telefono, Email, Contrasenya } = req.body;

  // Verifica que todos los campos no esten vacios.
  if (!Nombre || !Apellido || !Direccion || !Telefono || !Email || !Contrasenya) {
    return res.status(400).json({ message: 'Por favor, complete todos los campos.' });
  }

  try {
    // Verificar si el correo ya esta registrado
    const checkEmailQuery = 'SELECT * FROM clientes WHERE Email = ?';
    connection.query(checkEmailQuery, [Email], async (err, results) => {
      if (err) {
        console.error('Error al verificar el correo:', err);
        return res.status(500).json({ message: 'Error al registrar el cliente.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Este correo ya está registrado.' });
      }

      // Encriptar la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(Contrasenya, saltRounds);
      const insertQuery = `
        INSERT INTO clientes (Nombre, Apellido, Direccion, Telefono, Email, Contrasenya)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      connection.query(insertQuery, [Nombre, Apellido, Direccion, Telefono, Email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error al insertar el cliente:', err);
          return res.status(500).json({ message: 'Error al registrar el cliente.' });
        }

        res.status(201).json({ message: 'Cliente registrado con éxito.' });
      });
    });
  } catch (error) {
    console.error('Error al registrar el cliente:', error);
    res.status(500).json({ message: 'Error al registrar el cliente.' });
  }
});

module.exports = router;
