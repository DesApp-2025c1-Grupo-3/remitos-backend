const express = require("express");
const route = express.Router();
const mercaderiaController = require("../controllers/mercaderiaController");
const schemaValidator = require("../middlewares/schemaValidator");
const mercaderiaSchema = require("../schemas/mercaderiaSchema");

route.get("/mercaderias", mercaderiaController.getMercaderia);
route.get(
  "/mercaderias/:id",
  mercaderiaController.getMercaderiaById
);

// Crea una mercadería
route.post(
  "/mercaderias",
  schemaValidator(mercaderiaSchema),
  mercaderiaController.createMercaderia
);

// Actualiza una mercadería
route.put(
  "/mercaderias/:id",
  schemaValidator(mercaderiaSchema),
  mercaderiaController.updateMercaderia
);

// Borra una mercadería
route.delete(
  "/mercaderias/:id",
  mercaderiaController.deleteMercaderia
);

module.exports = route;
