const fs = require('fs');
const path = require('path');

function generateConfig() {
  const config = {
    development: {
      username: process.env.DB_USER || process.env.SQL_USERNAME || "postgres",
      password: process.env.DB_PASS || process.env.SQL_PASSWORD || "1234",
      database: process.env.DB_NAME || process.env.SQL_DATABASE || "desapp",
      host: process.env.DB_HOST || process.env.SQL_HOST || "localhost",
      port: process.env.SQL_PORT || "5432",
      dialect: "postgres",
      logging: false,
      seederStorage: "sequelize"
    },
    test: {
      username: process.env.DB_USER || process.env.SQL_USERNAME || "postgres",
      password: process.env.DB_PASS || process.env.SQL_PASSWORD || "1234",
      database: process.env.SQL_TEST_DATABASE || process.env.SQL_DATABASE || "desapp",
      host: process.env.DB_HOST || process.env.SQL_HOST || "localhost",
      port: process.env.SQL_PORT || "5432",
      dialect: "postgres",
      logging: false
    },
    production: {
      username: process.env.DB_USER || process.env.SQL_USERNAME || "postgres",
      password: process.env.DB_PASS || process.env.SQL_PASSWORD || "1234",
      database: process.env.DB_NAME || process.env.SQL_DATABASE || "desapp",
      host: process.env.DB_HOST || process.env.SQL_HOST || "localhost",
      port: process.env.SQL_PORT || "5432",
      dialect: "postgres",
      logging: false,
      native: true
    }
  };

  // Si hay DATABASE_URL (para Heroku/Render), parsearla
  if (process.env.DATABASE_URL) {
    const { parse } = require('pg-connection-string');
    const parsed = parse(process.env.DATABASE_URL);
    
    config.production = {
      ...config.production,
      ...parsed,
      username: parsed.user,
      native: true
    };
  }

  const configPath = path.join(__dirname, '..', 'config', 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Configuración de Sequelize generada en:', configPath);
}

generateConfig();
