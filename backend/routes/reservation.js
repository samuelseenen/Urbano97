const express = require('express');
const router = express.Router();
const qr = require('qrcode');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Ruta para hacer una reserva
module.exports = function(connection, key) {
  // IV (para propósitos de demostración, debería generarse de forma aleatoria en producción)
  const iv = Buffer.alloc(16, 0); // IV de 16 bytes, puedes generar uno aleatorio en producción

  router.post('/reservation', (req, res) => {
    const { barberId, date, hour, email } = req.body;
  
    // Generar un número aleatorio entre 1 y 1000
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
  
    // Consultar el id_cliente filtrando por el email proporcionado
    const getClientIdQuery = `SELECT id FROM clientes WHERE Email = ?`;
    connection.query(getClientIdQuery, [email], (err, results) => {
      if (err) {
        console.error('Error al obtener el id_cliente:', err);
        res.status(500).json({ message: 'Error al realizar la reserva' });
        return;
      }
  
      if (results.length === 0) {
        console.error('No se encontró ningún cliente con el email proporcionado:', email);
        res.status(404).json({ message: 'Cliente no encontrado' });
        return;
      }
  
      const clientId = results[0].id;

      // Crear la cadena de reserva con el formato especificado
      const reservationData = {
        id_peluquero: barberId,
        id_cliente: clientId,
        hora: hour,
        fecha: date,
        numero_aleatorio: randomNumber
      };
  
      // Convertir la cadena de reserva a JSON
      const reservationString = JSON.stringify(reservationData);
  
      // Encriptar la cadena de reserva
      const algorithm = 'aes-256-cbc'; // Utilizando AES con clave de 256 bits
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encryptedData = cipher.update(reservationString, 'utf8', 'hex');
      encryptedData += cipher.final('hex');
  
      // Generar el código QR a partir de la cadena encriptada
      qr.toDataURL(encryptedData, async (err, qrCodeDataUrl) => {
        if (err) {
          console.error('Error al generar el código QR:', err);
          res.status(500).json({ message: 'Error al generar el código QR' });
          return;
        }
  
        try {
          // Configurar el transportador SMTP para enviar correos electrónicos
          const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'pto.sanjay@gmail.com',
              pass: 'avgi dewn ywvp gnvx'
            }
          });
  
          // Adjuntar la imagen del código QR al correo electrónico
          const mailOptions = {
            from: 'pto.sanjay@gmail.com',
            to: email, // Usar el email proporcionado desde el frontend
            subject: 'Código QR de tu reserva',
            html: '<p>Adjunto encontrarás el código QR de tu reserva.</p>',
            attachments: [
              {
                filename: 'qr_code.png',
                content: qrCodeDataUrl.split(';base64,').pop(),
                encoding: 'base64'
              }
            ]
          };
  
          // Enviar el correo electrónico
          await transporter.sendMail(mailOptions);
  
          // Ejecutar la consulta SQL para insertar la reserva
          const insertQuery = `
            INSERT INTO reservas (EstadoReserva, QRReserva, fecha, id_peluquero, reserva, id_cliente, hora)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
  
          connection.query(insertQuery, ['pendiente', qrCodeDataUrl, date, barberId, reservationString, clientId, hour], (err, result) => {
            if (err) {
              console.error('Error al insertar la reserva:', err);
              res.status(500).json({ message: 'Error al realizar la reserva' });
              return;
            }
  
            res.status(200).json({ message: 'Reserva realizada con éxito' });
          });
        } catch (error) {
          console.error('Error al enviar el correo electrónico:', error);
          res.status(500).json({ message: 'Error al enviar el correo electrónico' });
        }
      });
    });
  });
  

  // Ruta para desencriptar el código QR
  router.post('/decrypt-qr', (req, res) => {
    const { encryptedData } = req.body;
  
    try {
      // Desencriptar la cadena de reserva
      const algorithm = 'aes-256-cbc'; // Utilizando AES con clave de 256 bits
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
      decryptedData += decipher.final('utf8');

  
      // Parsear los datos desencriptados
      const reservationData = JSON.parse(decryptedData);
      const { id_peluquero, id_cliente, fecha, hora } = reservationData;
  
      // Consultar el nombre del peluquero
      const peluqueroQuery = `SELECT nombre FROM peluqueros WHERE id = ?`;
      connection.query(peluqueroQuery, [id_peluquero], (err, peluqueroResult) => {
        if (err) {
          console.error('Error al consultar el nombre del peluquero:', err);
          res.status(500).json({ message: 'Error al consultar el nombre del peluquero' });
          return;
        }
  
        if (peluqueroResult.length === 0) {
          res.status(404).json({ message: 'Peluquero no encontrado' });
          return;
        }
  
        const nombrePeluquero = peluqueroResult[0].nombre;
  
        // Consultar el nombre y apellido del cliente
        const clienteQuery = `SELECT nombre, apellido FROM clientes WHERE id = ?`;
        connection.query(clienteQuery, [id_cliente], (err, clienteResult) => {
          if (err) {
            console.error('Error al consultar el nombre del cliente:', err);
            res.status(500).json({ message: 'Error al consultar el nombre del cliente' });
            return;
          }
  
          if (clienteResult.length === 0) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
          }
  
          const { nombre: nombreCliente, apellido: apellidoCliente } = clienteResult[0];
  
          // Enviar la respuesta con los datos necesarios
          res.status(200).json({
            message: 'Desencriptado correctamente',
            data: {
              nombrePeluquero,
              nombreCliente,
              apellidoCliente,
              fecha,
              hora
            }
          });
        });
      });
    } catch (error) {
      console.error('Error al desencriptar el código QR:', error);
      res.status(500).json({ message: 'Error al desencriptar el código QR' });
    }
  });
  

  return router; // Devuelve el enrutador
};
