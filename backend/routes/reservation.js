const express = require('express');
const router = express.Router();

// Ruta para hacer una reserva
module.exports = function(connection) {
  router.post('/reservation', (req, res) => {
    const { clientId, barberId, date, hour } = req.body;

    // Generar un número aleatorio entre 1 y 1000
    const randomNumber = Math.floor(Math.random() * 1000) + 1;

    // Crear la cadena de reserva con el formato especificado
    const reservationData = {
      id_peluquero: barberId,
      id_cliente: 1, // Por ahora, se fija en 1
      hora: hour,
      fecha: date,
      numero_aleatorio: randomNumber
    };
    var estado_reserva = 'pendiente';
    var qr_reserva = 'qweqw12312qwer';

    // Convertir la cadena de reserva a JSON
    const reservationString = JSON.stringify(reservationData);

    // Ejecutar la consulta SQL para insertar la reserva
    const insertQuery = `
      INSERT INTO reservas (EstadoReserva, QRReserva, fecha, id_peluquero, reserva)
      VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(insertQuery, [estado_reserva, qr_reserva, date, barberId, reservationString], (err, result) => {
      if (err) {
        console.error('Error al insertar la reserva:', err);
        res.status(500).json({ message: 'Error al realizar la reserva' });
        return;
      }

      res.status(200).json({ message: 'Reserva realizada con éxito' });
    });
  });

  return router;
};
