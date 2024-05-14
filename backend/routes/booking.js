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
            SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(reserva, ',', -2), ',', 1) AS id_peluquero FROM reservas
            WHERE SUBSTRING_INDEX(SUBSTRING_INDEX(reserva, ',', -2), ',', 1) IS NOT NULL
        )
    `;

    console.log(barbersQuery);

    connection.query(barbersQuery, [date], (err, barbersResults) => {
        if (err) {
            console.error('Error querying database for available barbers:', err);
            res.status(500).json({ message: 'Fallo' });
            return;
        }

        // Para cada peluquero, obtener sus horas disponibles
        const promises = barbersResults.map((barber) => {
            return new Promise((resolve, reject) => {
                const barberId = barber.id;

                // Consulta SQL para obtener las horas disponibles del peluquero
                const availableHoursQuery = `
                    SELECT TIME_FORMAT(horas, '%H:%i') AS horas FROM horas_disponibles
                    WHERE id_peluquero = ?
                `;

                connection.query(availableHoursQuery, [barberId], (err, hoursResults) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Filtrar las horas disponibles para el peluquero actual
                    const availableHours = hoursResults.map((row) => row.hora);

                    // Agregar las horas disponibles al objeto del peluquero
                    barber.availableHours = availableHours;

                    resolve(barber);
                });
            });
        });

        // Esperar a que todas las consultas de horas estén completas
        Promise.all(promises)
            .then((barbersWithHours) => {
                res.status(200).json(barbersWithHours);
            })
            .catch((error) => {
                console.error('Error fetching available hours:', error);
                res.status(500).json({ message: 'Fallo2' });
            });
    });
});


router.get('/barber/:barberId/:date', (req, res) => {
    const { barberId, date } = req.params;

    // Consulta SQL para obtener las horas disponibles del peluquero
    const availableHoursQuery = `
        SELECT horas FROM horas_disponibles
        WHERE id_peluquero = ?
    `;

    connection.query(availableHoursQuery, [barberId], (err, allHoursResults) => {
        if (err) {
            console.error('Error querying database for all hours:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        console.log('Horas disponibles:', allHoursResults);
        // Consulta SQL para obtener todas las reservas del peluquero para la fecha dada
        const reservationsQuery = `
        SELECT reserva FROM reservas
        WHERE id_peluquero = ? AND SUBSTRING_INDEX(SUBSTRING_INDEX(reserva, '"fecha":"', -1), '"', 1) = ?
    `;

    connection.query(reservationsQuery, [barberId, date], (err, reservationResults) => {
        if (err) {
            console.error('Error querying database for reservations:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    
        // Obtener las horas ocupadas de las reservas para el peluquero en la fecha dada
        let occupiedHours = [];
        if (reservationResults.length > 0) {
            occupiedHours = reservationResults.map((row) => {
                const reservation = JSON.parse(row.reserva);
                return reservation.hora;
            });
        }
    
        // Filtrar las horas disponibles
        const availableHours = allHoursResults
            .map((row) => row.horas)
            .filter((hour) => !occupiedHours.includes(hour));
        
        // Verificar si hay horas disponibles
        if (availableHours.length === 0) {
            res.status(200).json({ message: 'No quedan horas disponibles para el día seleccionado' });
        } else {
            res.status(200).json(availableHours);
        }
    });
    
    });
});




module.exports = router;
