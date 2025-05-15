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

/**
 * Get port from environment and store in Express.
 */
app.set("port", config.port || "3002");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());
app.use("/uploads", express.static("uploads"));
//rutas
app.use(rutas.rutasCliente);
app.use(rutas.rutasContacto);
app.use(rutas.rutasEstado);
app.use(rutas.rutasDestino);
app.use(rutas.rutasRemito);

module.exports = app;
