const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'urbano97'
});

// Ruta para obtener los peluqueros disponibles para una fecha
router.get('/barbers/:year/:month/:day', (req, res) => {
    const { year, month, day } = req.params;
    const date = `${year}-${month}-${day}`;

    // Consulta SQL para obtener los peluqueros disponibles para una fecha
    const barbersQuery = `
        SELECT id, nombre FROM Peluqueros
        WHERE id NOT IN (
            SELECT id_peluquero FROM reservas
            WHERE DATE(fecha) = ?
        )
    `;

    connection.query(barbersQuery, [date], (err, barbersResults) => {
        if (err) {
            console.error('Error querying database for available barbers:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        res.status(200).json(barbersResults);
    });
});

// Ruta para obtener las horas disponibles de un peluquero en una fecha determinada
router.get('/barber/:barberId/:date', (req, res) => {
    const { barberId, date } = req.params;

    // Consulta SQL para obtener todas las horas del peluquero
    const allHoursQuery = `
        SELECT hora FROM horas_disponibles
        WHERE id_peluquero = ?
    `;

    connection.query(allHoursQuery, [barberId], (err, allHoursResults) => {
        if (err) {
            console.error('Error querying database for all hours:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        const availableHours = [];
        
        // Recorremos todas las horas disponibles del peluquero
        allHoursResults.forEach((row) => {
            const hour = row.hora;

            // Consulta SQL para verificar si la hora está ocupada por alguna reserva
            const reservationQuery = `
                SELECT * FROM reservas
                WHERE id_peluquero = ? AND DATE(fecha) = ? AND reserva LIKE '%[${hour}]%'
            `;

            connection.query(reservationQuery, [barberId, date], (err, reservationResults) => {
                if (err) {
                    console.error('Error querying database for reservations:', err);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }

                // Si no hay reservas para esta hora, la agregamos a las disponibles
                if (reservationResults.length === 0) {
                    availableHours.push(hour);
                }

                // Si hemos recorrido todas las horas disponibles, respondemos con las disponibles
                if (availableHours.length === allHoursResults.length) {
                    res.status(200).json(availableHours);
                }
            });
        });
    });
});

module.exports = router;
