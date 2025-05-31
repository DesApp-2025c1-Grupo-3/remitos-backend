const express = require("express");

const route = express.Router();

const { Destino } = require("../models");

const destinoController = require("../controllers/destinoController");

const schemaValidator = require("../middlewares/schemaValidator");

const destinoSchema = require("../schemas/destinoSchema"); // Solo destino

const destinoContactoSchema = require("../schemas/destinoContactoSchema"); //Destino con Contacto

const destinoMiddleware = require("../middlewares/validateMiddleware"); //Trae todos los destinos

route.get("/destino", destinoController.getDestino); //Trae destino por ID

route.get(
  "/destino/:id",
  destinoMiddleware.validateId(Destino),
  destinoController.getDestinoById
); //Trae destinos filtrados

route.get(
  "/destinoFiltrado", //destinoMiddleware.validarFiltroDestino,
  destinoController.getDestinoFiltrado
); //Crea un cliente sin contacto Asociado

route.post(
  "/destino",
  schemaValidator(destinoSchema),
  destinoController.createDestino
); //Crea un cliente y un contacto y asocia ambos

route.post(
  "/destinoContacto",
  schemaValidator(destinoContactoSchema),
  destinoController.createDestinoWithContacto
); //Edita un destino

route.put(
  "/destino/:id",
  schemaValidator(destinoContactoSchema),
  destinoMiddleware.validateId(Destino),
  destinoController.updateDestino
); //Da de alta un destino borrado

route.put(
  "/destino/:id/darAlta",
  destinoMiddleware.validateId(Destino),
  destinoController.activateDestino
); //Borra un destino

route.delete(
  "/destino/:id",
  destinoMiddleware.validateId(Destino),
  destinoController.deleteDestino
);
module.exports = route;
//# sourceMappingURL=destino.route.js.map
