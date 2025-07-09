const rutasEstado = require("./estado.routes"); // <-- después vemos si hay que ajustar más adentro de routes

const rutasContacto = require("./contacto.routes");

const rutasCliente = require("./cliente.routes");

const rutasDestino = require("./destino.route");

const rutasRemito = require("./remito.routes");

const rutasMercaderia = require("./mercaderia.routes");

const rutasReportes = require("./reportes.routes");

module.exports = {
  rutasEstado,
  rutasCliente,
  rutasContacto,
  rutasDestino,
  rutasRemito,
  rutasMercaderia,
  rutasReportes,
};
//# sourceMappingURL=index.js.map
