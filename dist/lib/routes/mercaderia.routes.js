const express = require("express");

const route = express.Router();

const mercaderiaController = require("../controllers/mercaderiaController"); //const schemaValidator = require("../middlewares/schemaValidator");
//const clienteSchema = require("../schemas/clienteSchema");
//const clienteMiddleware = require("../middlewares/clienteMiddleware");

route.get("/mercaderias", mercaderiaController.getMercaderia);
route.get(
  "/mercaderias/:id", //clienteMiddleware.validateClienteId,
  mercaderiaController.getMercaderiaById
); //Crea un cliente

route.post(
  "/mercaderias", //schemaValidator(clienteSchema),
  mercaderiaController.createMercaderia
); //Crea un cliente y asocia un cliente que tambien crea

route.put(
  "/mercaderias/:id", //schemaValidator(clienteSchema),
  mercaderiaController.updateMercaderia
); //Borra un cliente

route.delete(
  "/mercaderias/:id", //clienteMiddleware.validateClienteId,
  mercaderiaController.deleteMercaderia
);
module.exports = route;
//# sourceMappingURL=mercaderia.routes.js.map
