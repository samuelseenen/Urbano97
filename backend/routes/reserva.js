const express = require('express');
const router = express.Router();

// Ruta para hacer una reserva
router.post('/reservation', (req, res) => {
  const { reservation } = req.body;

  // Procesar la información de la reserva
  const parsedReservation = JSON.parse(reservation);

  // Extraer los datos de la reserva
  const { clientId, barberId, date, hour, serviceId } = parsedReservation;
  const randomNumber = Math.floor(Math.random() * 1000) + 1;

  // Aquí deberías insertar los datos en la tabla de reservas usando una consulta SQL
  // Ejemplo con MySQL
  const insertQuery = `
    INSERT INTO reservas (id_cliente, id_peluquero, fecha, hora, id_servicio, numero_aleatorio)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Ejecutar la consulta SQL para insertar la reserva
  connection.query(insertQuery, [clientId, barberId, date, hour, serviceId, randomNumber], (err, result) => {
    if (err) {
      console.error('Error al insertar la reserva:', err);
      res.status(500).json({ message: 'Error al realizar la reserva' });
      return;
    }

    res.status(200).json({ message: 'Reserva realizada con éxito' });
  });
});

module.exports = router;
