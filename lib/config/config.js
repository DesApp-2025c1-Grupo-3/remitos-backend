const path = require("path");
const debug = require("debug");
const parse = require("pg-connection-string").parse;
const dotenv = require("dotenv");

function getEnvironment() {
  return process.env.NODE_ENV || "development";
}

function initializeEnv() {
  dotenv.config({
    path: path.resolve(process.cwd(), `.env.${getEnvironment()}`),
  });
}

function parseDatabaseUrlIfPresent() {
  const url = process.env.DATABASE_URL;

  if (url === undefined) {
    return {};
  }

  const config = parse(url);

  // Configuración específica para Neon y otros servicios en la nube
  return {
    username: config.user,
    password: config.password,
    database: config.database,
    host: config.host,
    port: config.port,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  };
}

function normalizePort(val) {
  const portNum = parseInt(val, 10);

  if (Number.isNaN(portNum)) {
    // named pipe
    return val;
  }

  if (portNum >= 0) {
    // port number
    return portNum;
  }

  return false;
}

function initializeConfig() {
  const environment = getEnvironment();
  let dbConfig = {
    username: process.env.DB_USER || process.env.SQL_USERNAME || "postgres",
    password: process.env.DB_PASS || process.env.SQL_PASSWORD || "1234",
    database: process.env.DB_NAME || process.env.SQL_DATABASE || "desapp",
    host: process.env.DB_HOST || process.env.SQL_HOST ||/**/ "localhost",
    port: process.env.SQL_PORT || "5432",
    dialect: "postgres",
    logging: false,
  };
  
  if (process.env.SQL_DATABASE_SCHEMA) {
    dbConfig.schema = process.env.SQL_DATABASE_SCHEMA;
  }
  
  if (environment === "development") {
    dbConfig.seederStorage = "sequelize";
  } else if (environment === "test") {
    dbConfig.database =
      process.env.SQL_TEST_DATABASE || process.env.SQL_DATABASE;
  } else if (environment === "production") {
    // En producción, usar completamente la configuración de la URL
    const cloudConfig = parseDatabaseUrlIfPresent();
    if (Object.keys(cloudConfig).length > 0) {
      dbConfig = cloudConfig;
    }
  }
  
  return {
    db: dbConfig,
    port: normalizePort(process.env.PORT || "3001"),
  };
}

initializeEnv();

module.exports = initializeConfig();
