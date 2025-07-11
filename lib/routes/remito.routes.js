const express = require("express");
const route = express.Router();
const remitoController = require("../controllers/remitoController");
const schemaValidator = require("../middlewares/schemaValidator");
const remitoMiddleware = require("../middlewares/remitoMiddleware");
const remitoSchema = require("../schemas/remitoSchema");
const upload = require("../middlewares/upload");

//Trae todos los remitos
route.get("/remito", remitoController.getRemitos);
//Trae remito por id
route.get(
  "/remito/:id",
  remitoMiddleware.validateRemitoId,
  remitoController.getRemitoById
);
//CREA SOLO EL MODELO REMITO CON SUS ATRIBUTOS
route.post(
  "/remito",
  upload.single("archivoAdjunto"),
  schemaValidator(remitoSchema),
  remitoMiddleware.validateNumeroAsignadoUnico,
  remitoController.createRemito
);
//CREA EL REMITO CON DESTINO Y SU CONTACTO Y CLIENTE Y SU CONTACTO
route.post(
  "/remitoFinal",
  upload.single("archivoAdjunto"),
  //schemaValidator(remitoSchema),
  remitoMiddleware.validateNumeroAsignadoUnico,
  remitoController.createRemitoWithClienteAndDestino
);
//Edita remito
route.put(
  "/remito/:id",
  remitoMiddleware.validateRemitoId,
  remitoMiddleware.validateNumeroAsignadoUnicoUpdate,
  remitoController.updateRemito
);
//Edita estado de un remito
route.put("/remito/:id/estado/:eid", remitoController.updateEstadoRemito);

//Borra remito
route.delete(
  "/remito/:id",
  remitoMiddleware.validateRemitoId,
  remitoController.deleteRemito
);

route.get(
  "/reportes/volumen-por-cliente-periodo",
  remitoController.getVolumenPorClientePeriodo
);

module.exports = route;
