const express = require('express');
const router = express.Router();
const qr = require('qrcode');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Ruta para hacer una reserva
module.exports = function(connection) {
  router.post('/reservation', (req, res) => {
    const { clientId, barberId, date, hour, email } = req.body;

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
    
    // Convertir la cadena de reserva a JSON
    const reservationString = JSON.stringify(reservationData);

    // Generar una clave aleatoria de 24 bytes (192 bits)
    const key = crypto.randomBytes(24);

    // Inicializar el vector de inicialización (IV)
    const iv = Buffer.alloc(16, 0); // Se recomienda generar un IV único para cada cifrado

    // Encriptar la cadena de reserva
    const algorithm = 'aes-192-cbc';
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
          to: 'samuelsenen@gmail.com',
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
          INSERT INTO reservas (EstadoReserva, QRReserva, fecha, id_peluquero, reserva)
          VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(insertQuery, ['pendiente', qrCodeDataUrl, date, barberId, reservationString], (err, result) => {
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

  return router;
};
