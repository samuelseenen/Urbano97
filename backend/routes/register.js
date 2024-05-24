const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

// Ruta para registrar un nuevo cliente
module.exports = function(connection) {
  router.post('/register', async (req, res) => {
    const { Nombre, Apellido, Direccion, Telefono, Email, Contrasenya } = req.body;

    // Verifica que todos los campos están presentes
    if (!Nombre || !Apellido || !Direccion || !Telefono || !Email || !Contrasenya) {
      return res.status(400).json({ message: 'Por favor, complete todos los campos.' });
    }

    try {
      // Encriptar la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(Contrasenya, saltRounds);

      // Insertar los datos en la base de datos
      const insertQuery = `
        INSERT INTO clientes (Nombre, Apellido, Direccion, Telefono, Email, Contrasenya)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      connection.query(insertQuery, [Nombre, Apellido, Direccion, Telefono, Email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error al insertar el cliente:', err);
          return res.status(500).json({ message: 'Error al registrar el cliente.' });
        }

        res.status(201).json({ message: 'Cliente registrado con exito.' });
      });
    } catch (error) {
      console.error('Error al registrar el cliente:', error);
      res.status(500).json({ message: 'Error al registrar el cliente.' });
    }
  });

  return router; // Devuelve el enrutador
};
