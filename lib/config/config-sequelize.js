const config = require("./config");

// Configuración específica para producción con Neon
const productionConfig = {
  ...config.db,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

module.exports = {
  development: config.db,
  test: config.db,
  production: productionConfig,
};
