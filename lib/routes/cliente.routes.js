const express = require("express");
const route = express.Router();
const clienteController = require("../controllers/clienteController");
const schemaValidator = require("../middlewares/schemaValidator");
const {
  clienteSchema,
  clienteConContactosSchema,
  clienteConUnContactoSchema,
} = require("../schemas/clienteSchema");
const clienteMiddleware = require("../middlewares/clienteMiddleware");

route.get("/cliente", clienteController.getCliente);
route.get(
  "/cliente/:id",
  clienteMiddleware.validateClienteId,
  clienteController.getClienteById
);
//Crea un cliente (puede incluir contactos)
route.post(
  "/cliente",
  schemaValidator(clienteConContactosSchema),
  clienteController.createCliente
);
//Crea un cliente con un solo contacto (endpoint específico)
route.post(
  "/clienteContacto",
  schemaValidator(clienteConUnContactoSchema),
  clienteController.createClienteWithContacto
);
//Edita un cliente (puede incluir contactos)
route.put(
  "/cliente/:id",
  schemaValidator(clienteConContactosSchema),
  clienteController.updateCliente
);
//Borra un cliente
route.delete(
  "/cliente/:id",
  clienteMiddleware.validateClienteId,
  clienteController.deleteCliente
);

module.exports = route;
