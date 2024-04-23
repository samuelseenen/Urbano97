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

router.get('/barber/:barberId/:date', (req, res) => {
    const { barberId, date } = req.params;

    // Consulta SQL para obtener todas las horas del peluquero
    const allHoursQuery = `
        SELECT horas FROM horas_disponibles
        WHERE id_peluquero = ?
    `;

    connection.query(allHoursQuery, [barberId], (err, allHoursResults) => {
        if (err) {
            console.error('Error querying database for all hours:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (allHoursResults.length === 0) {
            res.status(200).json({ message: 'No hay horas disponibles para este peluquero' });
            return;
        }

        const availableHours = [];
        let completedQueries = 0;
        
        // Recorremos todas las horas disponibles del peluquero
        allHoursResults.forEach((row) => {
            const hour = row.horas;

            // Consulta SQL para verificar si la hora está ocupada por alguna reserva
            const reservationQuery = `
                SELECT * FROM reservas
                WHERE id_peluquero = ? AND DATE(fecha) = ? AND SUBSTRING_INDEX(SUBSTRING_INDEX(reserva, ',', 4), ',', -1) = ?
            `;

            connection.query(reservationQuery, [barberId, date, hour], (err, reservationResults) => {
                if (err) {
                    console.error('Error querying database for reservations:', err);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }

                // Si no hay reservas para esta hora, la agregamos a las disponibles
                if (reservationResults.length === 0) {
                    availableHours.push(hour);
                }

                // Incrementamos el contador de consultas completadas
                completedQueries++;

                // Si hemos recorrido todas las horas disponibles, respondemos con las disponibles
                if (completedQueries === allHoursResults.length) {
                    res.status(200).json(availableHours);
                }
            });
        });
    });
});



module.exports = router;
