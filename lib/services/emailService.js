const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@ejemplo.com';
    
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true para 465, false para otros puertos
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      console.warn('⚠️ Brevo no configurado - variables de entorno faltantes');
      console.warn('📝 Variables requeridas: EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_FROM');
    }
  }

  async sendReminderEmail(remito, fechaAgenda, destinatarios = []) {
    if (!this.transporter) {
      console.error('❌ No se puede enviar email - Brevo no configurado');
      return false;
    }

    const fechaFormateada = new Date(fechaAgenda).toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Crear el contenido del email (común para todos)
    const emailContent = {
      subject: `Recordatorio: Remito ${remito.numeroAsignado} agendado para hoy`,
      text: `El remito ${remito.numeroAsignado} está agendado para hoy ${fechaFormateada}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">📋 Recordatorio de Remito</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
            <p style="margin: 0; font-size: 16px;">
              El remito <strong>${remito.numeroAsignado}</strong> está agendado para hoy <strong>${fechaFormateada}</strong>
            </p>
          </div>
          <div style="margin-top: 20px; font-size: 14px; color: #666;">
            <p><strong>Detalles del remito:</strong></p>
            <ul>
              <li>Número: ${remito.numeroAsignado}</li>
              <li>Fecha de emisión: ${new Date(remito.fechaEmision).toLocaleDateString('es-AR')}</li>
              <li>Prioridad: ${remito.prioridad}</li>
              ${remito.observaciones ? `<li>Observaciones: ${remito.observaciones}</li>` : ''}
            </ul>
          </div>
          <div style="margin-top: 30px; padding: 15px; background-color: #e7f3ff; border-radius: 6px;">
            <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
              Enviado desde el Sistema de Remitos • Powered by <a href="https://www.brevo.com" style="color: #007bff;">Brevo</a>
            </p>
          </div>
        </div>
      `
    };

    // Determinar destinatarios finales
    const destinatariosFinales = destinatarios.length > 0 ? destinatarios : [{ email: 'gianbellone@gmail.com' }];
    
    // Enviar email individual a cada destinatario
    let emailsEnviados = 0;
    let emailsFallidos = 0;

    for (const destinatario of destinatariosFinales) {
      try {
        const emailData = {
          from: `"Remitos ACME" <${this.fromEmail}>`,
          to: destinatario.email,
          ...emailContent
        };

        const result = await this.transporter.sendMail(emailData);
        emailsEnviados++;
      } catch (error) {
        emailsFallidos++;
        console.error(`❌ Error enviando email a ${destinatario.email}:`, error);
      }
    }

    // Log resumen solo si hay múltiples destinatarios o errores
    if (destinatariosFinales.length > 1 || emailsFallidos > 0) {
      console.log(`📧 Enviado a ${emailsEnviados} destinatarios${emailsFallidos > 0 ? `, ${emailsFallidos} fallidos` : ''}`);
    }
    
    // Retornar true si al menos un email se envió correctamente
    return emailsEnviados > 0;
  }

  async testConnection() {
    if (!this.transporter) {
      return { success: false, message: 'Brevo no configurado' };
    }

    try {
      // Verificar la conexión SMTP
      await this.transporter.verify();
      
      // Enviar un email de prueba
      const result = await this.sendReminderEmail({
        numeroAsignado: 'TEST-001',
        fechaEmision: new Date(),
        prioridad: 'normal',
        observaciones: 'Email de prueba del sistema con Brevo'
      }, new Date());
      
      return { 
        success: result, 
        message: result ? 'Conexión exitosa con Brevo' : 'Error en el envío' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Error de conexión con Brevo: ${error.message}` 
      };
    }
  }
}

module.exports = new EmailService();
