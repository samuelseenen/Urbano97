const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'urbano97' // Nombre de la base de datos
});

// Ruta para cancelar una reserva
router.delete('/cancel-reservation', async (req, res) => {
    const { email, fecha, hora } = req.query;

    try {
        // Consultar el id del cliente por su email
        const queryClient = 'SELECT id FROM clientes WHERE Email = ?';
        const clientResults = await queryAsync(connection, queryClient, [email]);

        if (clientResults.length === 0) {
            // Cliente no encontrado
            return res.status(404).json({ message: 'Client not found' });
        }

        const clientId = clientResults[0].id;

        // Eliminar la reserva del cliente por fecha, hora e ID de cliente
        const queryDeleteReservation = 'DELETE FROM reservas WHERE fecha = ? AND hora = ? AND id_cliente = ?';
        await queryAsync(connection, queryDeleteReservation, [fecha, hora, clientId]);

        res.status(200).json({ message: 'Reservation canceled successfully' });
    } catch (error) {
        console.error('Error canceling reservation:', error);
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
