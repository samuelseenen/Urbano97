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

// Ruta para cancelar una reserva
router.delete('/cancel-reservation', async (req, res) => {
    const { email, fecha, hora, clientId } = req.query;

    try {
        // Consultar el tipo de usuario por su email
        const queryClient = 'SELECT id, tipoUsuario FROM clientes WHERE Email = ?';
        const clientResults = await queryAsync(connection, queryClient, [email]);

        if (clientResults.length === 0) {
            // Cliente no encontrado
            return res.status(404).json({ message: 'Client not found' });
        }

        const userId = clientResults[0].id;
        const userType = clientResults[0].tipoUsuario;

        if (userType === 'admin' && clientId) {
            // Si es un administrador y se proporciona un clientId, cancelar la reserva del cliente específico
            const queryDeleteReservation = 'DELETE FROM reservas WHERE fecha = ? AND hora = ? AND id_cliente = ?';
            await queryAsync(connection, queryDeleteReservation, [fecha, hora, clientId]);
        } else {
            // Si no es administrador o no se proporciona un clientId, cancelar la reserva del usuario logueado
            const queryDeleteReservation = 'DELETE FROM reservas WHERE fecha = ? AND hora = ? AND id_cliente = ?';
            await queryAsync(connection, queryDeleteReservation, [fecha, hora, userId]);
        }

        res.status(200).json({ message: 'Reservation canceled successfully' });
    } catch (error) {
        console.error('Error canceling reservation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

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
