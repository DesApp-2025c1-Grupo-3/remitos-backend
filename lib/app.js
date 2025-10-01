/* eslint-disable no-console */
const express = require("express");
const app = express();
const compression = require("compression"); //	Comprimir respuestas para ser más rápido
const cookieParser = require("cookie-parser"); //	Leer cookies fácilmente
const cors = require("cors");
const helmet = require("helmet"); //Agregar seguridad automática
const logger = require("morgan"); //Mostrar logs de requests
///rutas
const rutas = require("./routes/index");
const config = require("./config/config.js");

// Servicios
const cronService = require("./services/cronService");

/**
 * Get port from environment and store in Express.
 */
app.set("port", config.port);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());
app.use("/uploads", express.static("uploads"));

// Health check endpoint para keep-alive
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Endpoint de diagnóstico de conectividad para Render
app.get("/api/email/diagnose", async (req, res) => {
  const net = require('net');
  
  try {
    console.log('🔍 Diagnóstico de conectividad SMTP...');
    
    // Test de conectividad básica
    const testConnection = (host, port) => {
      return new Promise((resolve) => {
        const socket = new net.Socket();
        const timeout = 10000;
        
        socket.setTimeout(timeout);
        
        socket.on('connect', () => {
          console.log(`✅ Conexión exitosa a ${host}:${port}`);
          socket.destroy();
          resolve({ success: true, message: `Conexión exitosa a ${host}:${port}` });
        });
        
        socket.on('timeout', () => {
          console.log(`❌ Timeout conectando a ${host}:${port}`);
          socket.destroy();
          resolve({ success: false, message: `Timeout conectando a ${host}:${port}` });
        });
        
        socket.on('error', (error) => {
          console.log(`❌ Error conectando a ${host}:${port} - ${error.message}`);
          socket.destroy();
          resolve({ success: false, message: `Error: ${error.message}` });
        });
        
        socket.connect(port, host);
      });
    };
    
    // Test de conectividad a Brevo
    const brevoTest = await testConnection('smtp-relay.brevo.com', 587);
    
    // Test de DNS
    const dns = require('dns');
    const dnsTest = await new Promise((resolve) => {
      dns.lookup('smtp-relay.brevo.com', (err, address) => {
        if (err) {
          resolve({ success: false, message: `DNS Error: ${err.message}` });
        } else {
          resolve({ success: true, message: `DNS resuelto: ${address}` });
        }
      });
    });
    
    // Información del entorno
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      EMAIL_HOST: process.env.EMAIL_HOST ? 'Configurado' : 'No configurado',
      EMAIL_PORT: process.env.EMAIL_PORT,
      platform: process.platform,
      nodeVersion: process.version
    };
    
    res.status(200).json({
      success: true,
      environment: envInfo,
      connectivity: {
        brevo: brevoTest,
        dns: dnsTest
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
    res.status(500).json({
      success: false,
      message: `Error en diagnóstico: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
});


//rutas
app.use(rutas.rutasCliente);
app.use(rutas.rutasContacto);
app.use(rutas.rutasEstado);
app.use(rutas.rutasDestino);
app.use(rutas.rutasRemito);
app.use(rutas.rutasMercaderia);
app.use("/api/reportes", rutas.rutasReportes);
app.use(rutas.rutasEmail);

// Rutas de tipos normalizados (al final para evitar conflictos)
app.use("/api/tipos-empresa", rutas.rutasTipoEmpresa);
app.use("/api/tipos-mercaderia", rutas.rutasTipoMercaderia);
app.use("/api/email-destinatarios", rutas.rutasEmailDestinatarios);

// Inicializar servicios de tareas programadas
if (process.env.NODE_ENV !== 'test') {
  cronService.init();
  console.log('📅 Servicio de recordatorios iniciado');
}

module.exports = app;
