const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = null;
    this.initialized = false;
    console.log('🔍 DEBUG - EmailService constructor llamado (Gmail SMTP)');
  }

  initialize() {
    if (this.initialized) {
      return;
    }
    
    console.log('🔍 DEBUG - Inicializando EmailService con Gmail SMTP...');
    console.log('🔍 DEBUG - Variables de entorno en initialize:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST ? 'Configurado (' + process.env.EMAIL_HOST + ')' : 'No configurado'}`);
    console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT || 'No configurado'}`);
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? 'Configurado (' + process.env.EMAIL_USER + ')' : 'No configurado'}`);
    console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM ? 'Configurado (' + process.env.EMAIL_FROM + ')' : 'No configurado'}`);
    console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? 'Configurado (longitud: ' + process.env.EMAIL_PASS.length + ')' : 'No configurado'}`);
    
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@ejemplo.com';
    
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('✅ Gmail SMTP configurado correctamente');
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true para 465, false para otros puertos
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        // Configuraciones para Gmail
        connectionTimeout: 60000, // 60 segundos
        greetingTimeout: 30000,   // 30 segundos
        socketTimeout: 60000,     // 60 segundos
        tls: {
          rejectUnauthorized: false,
          ciphers: 'ALL'
        },
        pool: true,
        maxConnections: 1,
        maxMessages: 1
      });
      console.log('✅ Transporter Gmail creado exitosamente');
    } else {
      console.warn('⚠️ Gmail SMTP no configurado - variables de entorno faltantes');
      console.warn('📝 Variables requeridas: EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_FROM');
      console.warn('📝 Variables faltantes:');
      if (!process.env.EMAIL_HOST) console.warn('   - EMAIL_HOST');
      if (!process.env.EMAIL_USER) console.warn('   - EMAIL_USER');
      if (!process.env.EMAIL_PASS) console.warn('   - EMAIL_PASS');
      if (!process.env.EMAIL_FROM) console.warn('   - EMAIL_FROM');
    }
    
    this.initialized = true;
  }

  async sendMail(emailData) {
    try {
      // Inicializar el servicio si no está inicializado
      this.initialize();
      
      if (!this.transporter) {
        throw new Error('Gmail SMTP no configurado');
      }
      
      console.log('🔍 DEBUG Gmail - Enviando a:', emailData.to);
      console.log('🔍 DEBUG Gmail - Asunto:', emailData.subject);
      console.log('🔍 DEBUG Gmail - From:', this.fromEmail);

      const result = await this.transporter.sendMail({
        from: `"Remitos ACME" <${this.fromEmail}>`,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
      });

      console.log('✅ Email enviado via Gmail SMTP exitosamente');
      console.log('🔍 DEBUG Gmail - Message ID:', result.messageId);
      return { messageId: result.messageId, success: true };
    } catch (error) {
      console.error('❌ Error enviando via Gmail SMTP:');
      console.error('   Message:', error.message);
      console.error('   Code:', error.code);
      throw error;
    }
  }

  async sendReminderEmail(remito, fechaAgenda, destinatarios = []) {
    console.log('🔍 DEBUG - Iniciando sendReminderEmail con Gmail SMTP...');
    
    // Inicializar el servicio si no está inicializado
    this.initialize();
    
    console.log('🔍 DEBUG - Variables de entorno al momento de ejecución:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST ? 'Configurado (' + process.env.EMAIL_HOST + ')' : 'No configurado'}`);
    console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT || 'No configurado'}`);
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? 'Configurado (' + process.env.EMAIL_USER + ')' : 'No configurado'}`);
    console.log(`   EMAIL_FROM: ${this.fromEmail ? 'Configurado (' + this.fromEmail + ')' : 'No configurado'}`);
    console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? 'Configurado (longitud: ' + process.env.EMAIL_PASS.length + ')' : 'No configurado'}`);
    console.log(`   Transporter configurado: ${!!this.transporter}`);
    
    if (!this.transporter) {
      console.error('❌ No se puede enviar email - Gmail SMTP no configurado');
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
              Enviado desde el Sistema de Remitos • Powered by Gmail
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
          to: destinatario.email,
          ...emailContent
        };

        console.log(`📧 Enviando email via Gmail SMTP a ${destinatario.email}...`);
        const result = await this.sendMail(emailData);
        emailsEnviados++;
        console.log(`✅ Email enviado via Gmail SMTP a ${destinatario.email}`);
      } catch (error) {
        emailsFallidos++;
        console.error(`❌ Error enviando email a ${destinatario.email}:`, error.message);
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
    this.initialize();
    
    if (!this.transporter) {
      return { success: false, message: 'Gmail SMTP no configurado' };
    }

    try {
      // Verificar la conexión SMTP
      await this.transporter.verify();
      
      // Enviar un email de prueba
      const result = await this.sendReminderEmail({
        numeroAsignado: 'TEST-001',
        fechaEmision: new Date(),
        prioridad: 'normal',
        observaciones: 'Email de prueba del sistema con Gmail SMTP'
      }, new Date());
      
      return { 
        success: result, 
        message: result ? 'Conexión exitosa con Gmail SMTP' : 'Error en el envío' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Error de conexión con Gmail SMTP: ${error.message}` 
      };
    }
  }
}

module.exports = new EmailService();