const express = require("express");
const router = express.Router();
const emailService = require("../services/emailService");
const cronService = require("../services/cronService");

// Ruta para probar la conexión del servicio de email
router.get("/api/email/test", async (req, res) => {
  try {
    const result = await emailService.testConnection();
    res.status(result.success ? 200 : 500).json({
      message: result.message,
      success: result.success,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: "Error testing email service",
      error: error.message,
      success: false
    });
  }
});

// Ruta para ejecutar manualmente el envío de recordatorios
router.post("/api/email/send-reminders", async (req, res) => {
  try {
    await cronService.executeNow();
    res.status(200).json({
      message: "Tarea de recordatorios ejecutada manualmente",
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: "Error ejecutando recordatorios",
      error: error.message,
      success: false
    });
  }
});

// Ruta para obtener el estado del servicio de cron
router.get("/api/email/cron-status", (req, res) => {
  try {
    const status = cronService.getStatus();
    res.status(200).json({
      ...status,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo estado del cron",
      error: error.message,
      success: false
    });
  }
});

// Ruta para cambiar la hora del cron
router.post("/api/email/update-schedule", (req, res) => {
  try {
    const { hora, minutos } = req.body;
    
    if (hora === undefined || minutos === undefined) {
      return res.status(400).json({
        message: "Parámetros requeridos: hora (0-23) y minutos (0-59)",
        success: false
      });
    }

    const result = cronService.updateSchedule(parseInt(hora), parseInt(minutos));
    
    res.status(200).json({
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta para obtener la configuración actual del cron
router.get("/api/email/cron-config", (req, res) => {
  try {
    const config = cronService.getCurrentConfig();
    res.status(200).json({
      ...config,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo configuración del cron",
      error: error.message,
      success: false
    });
  }
});

module.exports = router;

