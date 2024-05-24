const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'urbano97' // Nombre de la base de datos
});

// Ruta para manejar las solicitudes de obtener las reservas de un usuario por email
router.get('/', async (req, res) => {
    const { email } = req.query;

    try {
        // Consultar el id del cliente por su email
        const queryClient = 'SELECT id FROM clientes WHERE Email = ?';
        const clientResults = await queryAsync(connection, queryClient, [email]);

        if (clientResults.length === 0) {
            // Cliente no encontrado
            return res.status(404).json({ message: 'Client not found' });
        }

        const clientId = clientResults[0].id;

        // Consultar las reservas del cliente por su id
        const queryReservations = 'SELECT reserva FROM reservas WHERE id_cliente = ?';
        const reservationsResults = await queryAsync(connection, queryReservations, [clientId]);

        // Procesar las reservas para obtener el nombre del peluquero
        const reservationsData = await Promise.all(reservationsResults.map(async (reservation) => {
            const { id_peluquero, hora, fecha } = JSON.parse(reservation.reserva);
            const queryBarber = 'SELECT nombre FROM peluqueros WHERE id = ?';
            const barberResult = await queryAsync(connection, queryBarber, [id_peluquero]);

            const barberName = barberResult.length > 0 ? barberResult[0].nombre : 'Desconocido';

            // Comprobar si la fecha de la reserva es anterior al día actual
            const currentDate = new Date();
            const reservationDate = new Date(fecha);
            const status = reservationDate < currentDate ? 'Terminada' : 'Pendiente';

            return {
                id_cliente: clientId,
                peluquero: barberName,
                hora: hora,
                fecha: fecha,
                estado: status
            };
        }));

        res.status(200).json(reservationsData);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Función para ejecutar consultas SQL como una Promesa
function queryAsync(connection, sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

module.exports = router;
