const express = require("express");
const route = express.Router();
const remitoController = require("../controllers/remitoController");
const schemaValidator = require("../middlewares/schemaValidator");
const remitoMiddleware = require("../middlewares/remitoMiddleware");
const remitoSchema = require("../schemas/remitoSchema");

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
  schemaValidator(remitoSchema),
  remitoController.createRemito
);
//CREA EL REMITO CON DESTINO Y SU CONTACTO Y CLIENTE Y SU CONTACTO
route.post(
  "/remito",
  schemaValidator(remitoSchema),
  remitoController.createRemitoWithClienteAndDestino
);
//Edita remito
route.put(
  "/remito/:id",
  schemaValidator(remitoSchema),
  remitoController.updateRemito
);
//Borra remito
route.delete(
  "/remito/:id",
  remitoMiddleware.validateRemitoId,
  remitoController.deleteRemito
);

module.exports = route;
