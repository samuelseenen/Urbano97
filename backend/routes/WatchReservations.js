const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config({ path: 'dotenv.env' });

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
// Ruta para manejar las solicitudes de obtener las reservas de un usuario por email
router.get('/', async (req, res) => {
    const { email } = req.query;

    try {
        // Consultar el tipo de usuario y el id del cliente por su email
        const queryClient = 'SELECT id, tipoUsuario, nombre FROM clientes WHERE Email = ?';
        const clientResults = await queryAsync(connection, queryClient, [email]);

        if (clientResults.length === 0) {
            // Cliente no encontrado
            return res.status(404).json({ message: 'Client not found' });
        }

        const clientId = clientResults[0].id;
        const clientType = clientResults[0].tipoUsuario;

        let queryReservations;
        let reservationsParams;

        if (clientType === 'admin') {
            // Consultar todas las reservas para un administrador
            queryReservations = 'SELECT reserva, id_cliente FROM reservas';
            reservationsParams = [];
        } else {
            // Consultar las reservas del cliente por su id
            queryReservations = 'SELECT reserva, id_cliente FROM reservas WHERE id_cliente = ?';
            reservationsParams = [clientId];
        }

        const reservationsResults = await queryAsync(connection, queryReservations, reservationsParams);

        // Procesar las reservas para obtener el nombre del peluquero y el nombre del cliente
        const reservationsData = await Promise.all(reservationsResults.map(async (reservation) => {
            const { id_peluquero, hora, fecha } = JSON.parse(reservation.reserva);
            const queryBarber = 'SELECT nombre FROM peluqueros WHERE id = ?';
            const barberResult = await queryAsync(connection, queryBarber, [id_peluquero]);

            const barberName = barberResult.length > 0 ? barberResult[0].nombre : 'Desconocido';

            // Obtener el nombre del cliente
            const queryClientName = 'SELECT nombre FROM clientes WHERE id = ?';
            const clientNameResult = await queryAsync(connection, queryClientName, [reservation.id_cliente]);

            const clientName = clientNameResult.length > 0 ? clientNameResult[0].nombre : 'Desconocido';

            // Comprobar si la fecha de la reserva es anterior al dia actual
            const currentDate = new Date();
            const reservationDate = new Date(fecha);
            const status = reservationDate < currentDate ? 'Terminada' : 'Pendiente';

            return {
                id_cliente: reservation.id_cliente,
                nombre_cliente: clientName,
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
