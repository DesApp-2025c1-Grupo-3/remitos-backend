#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Module dependencies.
 */

const debugPkg = require("debug");
const http = require("http");
const app = require("../lib/app");
const db = require("../lib/models");

const debug = debugPkg("js/www:server");

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on the port set on the app, on all network interfaces.
 */
const port = app.get("port");
if (!port) {
  throw "¡¡Hay que setear el port de la aplicación Express!!";
}

// Run sequelize before listen
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conexión a la base de datos exitosa");

    // Aquí agregamos el sync
    return db.sequelize.sync({ alter: true });
    // alter:true ajusta las tablas si hay cambios (más seguro que force:true)
  })
  .then(() => {
    console.log("📄 Base de datos sincronizada");

    server.listen(port, () => {
      console.log(`¡Aplicación iniciada! ====> 🌎 http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "❌ Error conectando o sincronizando la base de datos:",
      error
    );
    process.exit(1);
  });

server.on("error", onError);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
