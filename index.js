const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post("/api/form", (req, res) => {
  nodemailer.createTestAccount((err, account) => {
    const htmlEmail = `
        <h3>Hemos recido tu mensaje: </h3>
        <ul>
            <li>Email: ${req.body.email}</li>
            <li>Asunto: ${req.body.asunto}</li>
        </ul>
        <h3>Mensaje</h3>
        <p>${req.body.mensaje}</p>
        <h3>Pronto nos pondremos en contacto</h3>
      `;
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      auth: {
        user: "daniel.gutierrez13@outlook.com", //El email del servicio SMTP que va a utilizar (en este caso Gmail)
        pass: "Gutierrez13" // La contraseña de dicho SMTP
      }
    });

    let mailOptions = {
      from: "daniel.gutierrez13@outlook.com", // Quien manda el email
      to: req.body.email, // El email de destino
      replyTo: "daniel.gutierrez13@outlook.com",
      subject: req.body.asunto, // El asunto del email
      text: req.body.mensaje, // El mensaje
      html: htmlEmail // La parte HTML del email
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res.status(500).send({
            message: err.message || "Error al enviar email.",
            status: false
        });
      }
      res.send({
        data: info,
        message: "Mensaje Enviado",
        status: true
      });
    });
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor a la escucha en el puerto ${PORT}`);
});