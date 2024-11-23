import { fileURLToPath } from 'url';
import path from 'path'
import handlebars from 'handlebars';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();


export default class NotificacionCorreo {
    async notificacionCorreo(datosCliente) {
      const filename = fileURLToPath(import.meta.url);
      const dir = path.dirname(`${filename}`);
      const plantillaHTML = fs.readFileSync(path.join(dir, '../utiles/handlebars/plantilla.hbs'), 'utf-8');
  
      const template = handlebars.compile(plantillaHTML);
  
      const datos = {
        nombre: datosCliente.nombre,
        idReclamo: datosCliente.idReclamo,
        estado: datosCliente.estado
      };
      
      const correoHtml = template(datos);
  
      const transporte = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.CORREO,
          pass: process.env.CLAVE
        },
        tls: {
          rejectUnauthorized: false
        }
      });
  
      const mailOptions = {
        to: datosCliente.correoElectronico,
        subject: "Reclamo",
        text: "Estado de Reclamo fue modificado",
        html: correoHtml
      };
  
      console.log("Datos del cliente para el envío:", datosCliente);
  
      try {
        const info = await transporte.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
        return { estado: 'OK', mensaje: 'Correo enviado correctamente' };
      } catch (error) {
        console.error("Error sending email: ", error);
        return { estado: 'Falla', mensaje: 'Error al enviar el correo' };
      }
    }
  }