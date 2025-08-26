const rutasEstado = require("./estado.routes");
const rutasContacto = require("./contacto.routes");
const rutasCliente = require("./cliente.routes");
const rutasDestino = require("./destino.route");
const rutasRemito = require("./remito.routes");
const rutasMercaderia = require("./mercaderia.routes");
const rutasReportes = require("./reportes.routes");
const rutasTipoEmpresa = require("./tipoEmpresa.routes");
const rutasTipoMercaderia = require("./tipoMercaderia.routes");

module.exports = {
  rutasEstado,
  rutasCliente,
  rutasContacto,
  rutasDestino,
  rutasRemito,
  rutasMercaderia,
  rutasReportes,
  rutasTipoEmpresa,
  rutasTipoMercaderia,
};
