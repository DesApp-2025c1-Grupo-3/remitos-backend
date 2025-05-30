const express = require("express");
const route = express.Router();
const { Mercaderia } = require("../models");
const mercaderiaController = require("../controllers/mercaderiaController");
const schemaValidator = require("../middlewares/schemaValidator");
const mercaderiaSchema = require("../schemas/mercaderiaSchema");
const middleware = require("../middlewares/validateMiddleware");

//Trae todas las mercaderias
route.get("/mercaderias", mercaderiaController.getMercaderia);
//Trae una mercaderia por ID
route.get(
  "/mercaderias/:id",
  middleware.validateId(Mercaderia),
  mercaderiaController.getMercaderiaById
);
//Crea una mercaderia
route.post(
  "/mercaderias",
  schemaValidator(mercaderiaSchema),
  mercaderiaController.createMercaderia
);
//Edita una mercaderia
route.put(
  "/mercaderias/:id",
  schemaValidator(mercaderiaSchema),
  mercaderiaController.updateMercaderia
);
//Borra un cliente
route.delete(
  "/mercaderias/:id",
  middleware.validateId(Mercaderia),
  mercaderiaController.deleteMercaderia
);

module.exports = route;
