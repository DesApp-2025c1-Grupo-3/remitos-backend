const { google } = require('googleapis');

class EmailService {
  constructor() {
    this.gmail = null;
    this.oauth2Client = null;
    this.fromEmail = null;
    this.initialized = false;
    console.log('🔍 DEBUG - EmailService constructor llamado (Gmail API)');
  }

  initialize() {
    if (this.initialized) {
      return;
    }
    
    console.log('🔍 DEBUG - Inicializando EmailService con Gmail API...');
    console.log('🔍 DEBUG - Variables de entorno en initialize:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   GMAIL_CLIENT_ID: ${process.env.GMAIL_CLIENT_ID ? 'Configurado (longitud: ' + process.env.GMAIL_CLIENT_ID.length + ')' : 'No configurado'}`);
    console.log(`   GMAIL_CLIENT_SECRET: ${process.env.GMAIL_CLIENT_SECRET ? 'Configurado (longitud: ' + process.env.GMAIL_CLIENT_SECRET.length + ')' : 'No configurado'}`);
    console.log(`   GMAIL_REFRESH_TOKEN: ${process.env.GMAIL_REFRESH_TOKEN ? 'Configurado (longitud: ' + process.env.GMAIL_REFRESH_TOKEN.length + ')' : 'No configurado'}`);
    console.log(`   GMAIL_USER_EMAIL: ${process.env.GMAIL_USER_EMAIL ? 'Configurado (' + process.env.GMAIL_USER_EMAIL + ')' : 'No configurado'}`);
    
    this.fromEmail = process.env.GMAIL_USER_EMAIL || 'noreply@ejemplo.com';
    
    if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN && process.env.GMAIL_USER_EMAIL) {
      console.log('✅ Gmail API configurado correctamente');
      
      try {
        // Configurar OAuth2 Client
        this.oauth2Client = new google.auth.OAuth2(
          process.env.GMAIL_CLIENT_ID,
          process.env.GMAIL_CLIENT_SECRET,
          'https://developers.google.com/oauthplayground'
        );

        // Establecer las credenciales con el refresh token
        this.oauth2Client.setCredentials({
          refresh_token: process.env.GMAIL_REFRESH_TOKEN
        });
        
        // Manejar errores de token expirado
        this.oauth2Client.on('tokens', (tokens) => {
          if (tokens.refresh_token) {
            console.log('⚠️  Nuevo refresh token recibido - considera actualizar GMAIL_REFRESH_TOKEN en tu .env');
          }
        });

        // Crear instancia de Gmail API
        this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
        
        console.log('✅ Cliente OAuth2 y Gmail API inicializados exitosamente');
      } catch (error) {
        console.error('❌ Error inicializando Gmail API:', error.message);
        this.gmail = null;
        this.oauth2Client = null;
      }
    } else {
      console.warn('⚠️ Gmail API no configurado - variables de entorno faltantes');
      console.warn('📝 Variables requeridas: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER_EMAIL');
      console.warn('📝 Variables faltantes:');
      if (!process.env.GMAIL_CLIENT_ID) console.warn('   - GMAIL_CLIENT_ID');
      if (!process.env.GMAIL_CLIENT_SECRET) console.warn('   - GMAIL_CLIENT_SECRET');
      if (!process.env.GMAIL_REFRESH_TOKEN) console.warn('   - GMAIL_REFRESH_TOKEN');
      if (!process.env.GMAIL_USER_EMAIL) console.warn('   - GMAIL_USER_EMAIL');
    }
    
    this.initialized = true;
  }

  /**
   * Construye un mensaje MIME en formato RFC 2822
   * @param {Object} emailData - Datos del email (to, subject, text, html)
   * @returns {string} - Mensaje en formato MIME codificado en base64url
   */
  createMimeMessage(emailData) {
    const fromName = process.env.EMAIL_FROM_NAME || 'Remitos ACME';
    const boundary = `boundary_${Date.now()}`;
    
    // Construir el mensaje MIME
    const messageParts = [
      `From: "${fromName}" <${this.fromEmail}>`,
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      emailData.text || '',
      '',
    ];

    // Agregar versión HTML si existe
    if (emailData.html) {
      messageParts.push(
        `--${boundary}`,
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        emailData.html,
        ''
      );
    }

    messageParts.push(`--${boundary}--`);

    // Unir todas las partes
    const message = messageParts.join('\r\n');

    // Codificar en base64url (requerido por Gmail API)
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return encodedMessage;
  }

  async sendMail(emailData) {
    try {
      // Inicializar el servicio si no está inicializado
      this.initialize();
      
      if (!this.gmail) {
        throw new Error('Gmail API no configurado');
      }
      
      console.log('🔍 DEBUG Gmail API - Enviando a:', emailData.to);
      console.log('🔍 DEBUG Gmail API - Asunto:', emailData.subject);
      console.log('🔍 DEBUG Gmail API - From:', this.fromEmail);
      console.log('🔍 DEBUG Gmail API - Entorno:', process.env.NODE_ENV);

      // Crear mensaje MIME
      const encodedMessage = this.createMimeMessage(emailData);

      // Enviar el mensaje usando Gmail API
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      console.log('✅ Email enviado via Gmail API exitosamente');
      console.log('🔍 DEBUG Gmail API - Message ID:', response.data.id);
      return { messageId: response.data.id, success: true };
    } catch (error) {
      console.error('❌ Error enviando via Gmail API:');
      console.error('   Message:', error.message);
      console.error('   Code:', error.code);
      
      // Detectar errores específicos de autenticación
      if (error.message && error.message.includes('invalid_grant')) {
        console.error('\n⚠️  ERROR DE AUTENTICACIÓN: El refresh token ha expirado o es inválido');
        console.error('📝 Para solucionarlo:');
        console.error('   1. Ejecuta: node scripts/generate-gmail-refresh-token.js');
        console.error('   2. O sigue las instrucciones manuales en:');
        console.error('      https://developers.google.com/oauthplayground');
        console.error('   3. Actualiza GMAIL_REFRESH_TOKEN en tu archivo .env');
        console.error('   4. Reinicia el contenedor Docker si es necesario\n');
      }
      
      if (error.response) {
        console.error('   Response status:', error.response.status);
        console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('   Stack:', error.stack);
      }
      
      throw error;
    }
  }

  async sendReminderEmail(remito, fechaAgenda, destinatarios = []) {
    console.log('🔍 DEBUG - Iniciando sendReminderEmail con Gmail API...');
    
    // Inicializar el servicio si no está inicializado
    this.initialize();
    
    console.log('🔍 DEBUG - Variables de entorno al momento de ejecución:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   GMAIL_CLIENT_ID: ${process.env.GMAIL_CLIENT_ID ? 'Configurado' : 'No configurado'}`);
    console.log(`   GMAIL_CLIENT_SECRET: ${process.env.GMAIL_CLIENT_SECRET ? 'Configurado' : 'No configurado'}`);
    console.log(`   GMAIL_REFRESH_TOKEN: ${process.env.GMAIL_REFRESH_TOKEN ? 'Configurado' : 'No configurado'}`);
    console.log(`   GMAIL_USER_EMAIL: ${this.fromEmail ? 'Configurado (' + this.fromEmail + ')' : 'No configurado'}`);
    console.log(`   Gmail API configurado: ${!!this.gmail}`);
    
    if (!this.gmail) {
      console.error('❌ No se puede enviar email - Gmail API no configurado');
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
              Enviado desde el Sistema de Remitos • Powered by Gmail API
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

        console.log(`📧 Enviando email via Gmail API a ${destinatario.email}...`);
        const result = await this.sendMail(emailData);
        emailsEnviados++;
        console.log(`✅ Email enviado via Gmail API a ${destinatario.email}`);
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
    
    if (!this.gmail) {
      return { success: false, message: 'Gmail API no configurado' };
    }

    try {
      // Verificar que podemos obtener el perfil del usuario (prueba de conexión)
      const profile = await this.gmail.users.getProfile({ userId: 'me' });
      console.log('✅ Conexión con Gmail API verificada:', profile.data.emailAddress);
      
      // Enviar un email de prueba
      const result = await this.sendReminderEmail({
        numeroAsignado: 'TEST-001',
        fechaEmision: new Date(),
        prioridad: 'normal',
        observaciones: 'Email de prueba del sistema con Gmail API'
      }, new Date());
      
      return { 
        success: result, 
        message: result ? 'Conexión exitosa con Gmail API' : 'Error en el envío',
        email: profile.data.emailAddress
      };
    } catch (error) {
      console.error('❌ Error en testConnection:', error.message);
      return { 
        success: false, 
        message: `Error de conexión con Gmail API: ${error.message}` 
      };
    }
  }
}

module.exports = new EmailService();
