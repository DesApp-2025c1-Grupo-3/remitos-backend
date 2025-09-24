const cron = require('node-cron');
const { Remito, Estado, EmailDestinatario } = require('../models');
const emailService = require('./emailService');

class CronService {
  constructor() {
    this.isInitialized = false;
    this.currentSchedule = '0 9 * * *'; // Hora por defecto: 09:00
    this.cronTask = null;
    this.timezone = "America/Argentina/Buenos_Aires";
  }

  init() {
    if (this.isInitialized) {
      console.log('⚠️ CronService ya está inicializado');
      return;
    }

    console.log('⏰ Iniciando servicio de tareas programadas...');
    
    // Crear la tarea programada con la hora configurada
    this.createScheduledTask();

    // Tarea de prueba que se ejecuta cada minuto (DESHABILITADA)
    // cron.schedule('* * * * *', async () => {
    //   console.log('🧪 Tarea de prueba cada minuto - TESTING');
    //   await this.sendDailyReminders();
    // });

    this.isInitialized = true;
    console.log('✅ Servicio de tareas programadas iniciado correctamente');
    console.log(`📅 Recordatorios programados para: ${this.getFormattedTime()} (UTC-3)`);
  }

  async sendDailyReminders() {
    try {
      console.log('📋 Buscando remitos agendados para hoy...');
      
      // Obtener la fecha de hoy en formato YYYY-MM-DD
      // Obtener la fecha actual en la zona horaria de Argentina
      const now = new Date();
      const argentinaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}));
      
      // Crear rango de 00:00 a 23:59:59 del día actual en Argentina
      const todayStart = new Date(argentinaTime.getFullYear(), argentinaTime.getMonth(), argentinaTime.getDate());
      const todayEnd = new Date(argentinaTime.getFullYear(), argentinaTime.getMonth(), argentinaTime.getDate() + 1);
      
      console.log(`📅 Buscando remitos para el día: ${todayStart.toISOString().split('T')[0]} (Argentina)`);
      console.log(`🕐 Rango de búsqueda: ${todayStart.toISOString()} a ${todayEnd.toISOString()}`);

      // Buscar remitos con estado "Agendado" y fechaAgenda = hoy
      const remitosAgendados = await Remito.findAll({
        include: [
          {
            model: Estado,
            as: 'estado',
            where: { nombre: 'Agendado' }
          }
        ],
        where: {
          fechaAgenda: {
            [require('sequelize').Op.gte]: todayStart,
            [require('sequelize').Op.lt]: todayEnd
          }
        }
      });

      console.log(`📊 Encontrados ${remitosAgendados.length} remitos agendados para hoy`);

      if (remitosAgendados.length === 0) {
        console.log('ℹ️ No hay remitos agendados para hoy');
        return;
      }

      // Obtener destinatarios configurados
      const destinatarios = await EmailDestinatario.findAll({
        where: { activo: true },
        order: [['email', 'ASC']]
      });

      console.log(`📧 Encontrados ${destinatarios.length} destinatarios configurados`);

      if (destinatarios.length === 0) {
        console.log('⚠️ No hay destinatarios configurados para enviar recordatorios');
        return;
      }

      // Enviar recordatorio para cada remito a todos los destinatarios
      let emailsEnviados = 0;
      let emailsFallidos = 0;

      for (const remito of remitosAgendados) {
        const enviado = await emailService.sendReminderEmail(remito, remito.fechaAgenda, destinatarios);
        
        if (enviado) {
          emailsEnviados++;
        } else {
          emailsFallidos++;
        }
      }

      console.log(`📊 Resumen: ${emailsEnviados} remitos procesados, ${emailsFallidos} fallidos`);
      
    } catch (error) {
      console.error('❌ Error en sendDailyReminders:', error);
    }
  }

  // Método para ejecutar manualmente la tarea (útil para testing)
  async executeNow() {
    console.log('🚀 Ejecutando tarea de recordatorios manualmente...');
    await this.sendDailyReminders();
  }

  // Crear tarea programada
  createScheduledTask() {
    if (this.cronTask) {
      this.cronTask.destroy();
    }
    
    this.cronTask = cron.schedule(this.currentSchedule, async () => {
      console.log(`🔔 Ejecutando tarea de recordatorios de remitos - ${this.getFormattedTime()}`);
      await this.sendDailyReminders();
    }, {
      scheduled: true,
      timezone: this.timezone
    });
  }

  // Cambiar la hora del cron
  updateSchedule(hour, minute) {
    // Validar parámetros
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error('Hora inválida. Use formato 24h: hour (0-23), minute (0-59)');
    }

    // Crear nueva expresión cron: 'minute hour * * *'
    const newSchedule = `${minute} ${hour} * * *`;
    
    console.log(`🔄 Actualizando horario de cron de ${this.getFormattedTime()} a ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    
    this.currentSchedule = newSchedule;
    
    // Reiniciar la tarea con el nuevo horario
    this.createScheduledTask();
    
    console.log(`✅ Horario actualizado exitosamente a ${this.getFormattedTime()}`);
    
    return {
      success: true,
      message: `Horario actualizado a ${this.getFormattedTime()}`,
      newSchedule: this.currentSchedule,
      formattedTime: this.getFormattedTime()
    };
  }

  // Obtener hora formateada desde la expresión cron
  getFormattedTime() {
    const [minute, hour] = this.currentSchedule.split(' ');
    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }

  // Obtener configuración actual
  getCurrentConfig() {
    return {
      schedule: this.currentSchedule,
      formattedTime: this.getFormattedTime(),
      timezone: this.timezone,
      initialized: this.isInitialized,
      isRunning: this.cronTask ? this.cronTask.running : false
    };
  }

  // Método para verificar el estado del servicio
  getStatus() {
    return {
      initialized: this.isInitialized,
      timezone: this.timezone,
      schedule: `${this.getFormattedTime()} diario`,
      cronExpression: this.currentSchedule,
      isRunning: this.cronTask ? this.cronTask.running : false,
      nextRun: this.isInitialized ? 'Calculado por node-cron' : 'No inicializado'
    };
  }
}

module.exports = new CronService();
