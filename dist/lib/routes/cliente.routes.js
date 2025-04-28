const express = require("express");

const route = express.Router();

const clienteController = require("../controllers/clienteController");

const schemaValidator = require("../middlewares/schemaValidator");

const clienteSchema = require("../schemas/clienteSchema");

const clienteMiddleware = require("../middlewares/clienteMiddleware");

route.get("/cliente", clienteController.getCliente);
route.get(
  "/cliente/:id",
  clienteMiddleware.validateClienteId,
  clienteController.getClienteById
); //Crea un cliente

route.post(
  "/cliente",
  schemaValidator(clienteSchema),
  clienteController.createCliente
); //Crea un cliente y asocia un cliente que tambien crea

route.post("/clienteContacto", clienteController.createClienteWithContacto);
route.put(
  "/cliente/:id",
  schemaValidator(clienteSchema),
  clienteController.updateCliente
);
route.delete(
  "/cliente/:id",
  clienteMiddleware.validateClienteId,
  clienteController.deleteCliente
);
module.exports = route;
//# sourceMappingURL=cliente.routes.js.map
