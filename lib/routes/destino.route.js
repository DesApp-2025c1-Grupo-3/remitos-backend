const express = require("express");
const route = express.Router();
const { Destino } = require("../models");
const destinoController = require("../controllers/destinoController");
const schemaValidator = require("../middlewares/schemaValidator");
const destinoSchema = require("../schemas/destinoSchema");
const destinoContactoSchema = require("../schemas/destinoContactoSchema");
const destinoUpdateSchema = require("../schemas/destinoUpdateSchema");
const destinoMiddleware = require("../middlewares/validateMiddleware");
const contactoSchema = require("../schemas/contactoSchema");

route.get("/destino", destinoController.getDestino);

route.get(
  "/destino/:id",
  destinoMiddleware.validateId(Destino),
  destinoController.getDestinoById
);

route.get("/destinoFiltrado", destinoController.getDestinoFiltrado);

route.post(
  "/destino",
  schemaValidator(destinoSchema),
  destinoController.createDestino
);

route.post(
  "/destinoContacto",
  schemaValidator(destinoContactoSchema),
  destinoController.createDestinoWithContacto
);

route.post(
  "/agregarContactoADestino/:id",
  destinoMiddleware.validateId(Destino),
  schemaValidator(contactoSchema),
  destinoController.addContactoToDestino
);

route.put(
  "/destino/:id",
  schemaValidator(destinoUpdateSchema),
  destinoMiddleware.validateId(Destino),
  destinoController.updateDestino
);

route.put(
  "/destino/:id/darAlta",
  destinoMiddleware.validateId(Destino),
  destinoController.activateDestino
);

route.delete(
  "/destino/:id",
  destinoMiddleware.validateId(Destino),
  destinoController.deleteDestino
);

module.exports = route;
