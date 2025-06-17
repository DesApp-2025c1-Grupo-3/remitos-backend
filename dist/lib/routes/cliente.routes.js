const express = require("express");

const route = express.Router();

const { Cliente, Contacto } = require("../models");

const clienteController = require("../controllers/clienteController");

const schemaValidator = require("../middlewares/schemaValidator");

const clienteSchema = require("../schemas/clienteSchema");

const clienteMiddleware = require("../middlewares/validateMiddleware");

const contactoSchema = require("../schemas/contactoSchema"); //Trae todos los clientes

route.get("/cliente", clienteController.getCliente); //Trae todos los clientes por ID

route.get(
  "/cliente/:id",
  clienteMiddleware.validateId(Cliente),
  clienteController.getClienteById
); //Crea un cliente -solo cliente-

route.post(
  "/cliente",
  schemaValidator(clienteSchema),
  clienteController.createCliente
); //Crea un cliente y un contacto asociando ambos

route.post(
  "/clienteContacto",
  schemaValidator(clienteSchema),
  clienteController.createClienteWithContacto
); //Agrega otro contacto a un cliente

route.post(
  "/agregarContactoACliente/:id",
  clienteMiddleware.validateId(Cliente),
  schemaValidator(contactoSchema),
  clienteController.addContactoToCliente
); //Edita un cliente

route.put(
  "/cliente/:id",
  schemaValidator(clienteSchema),
  clienteController.updateCliente
); //Da de alta un cliente borrado

route.put(
  "/cliente/:id/darAlta",
  clienteMiddleware.validateId(Cliente),
  clienteController.activateCliente
); //Borra un cliente

route.delete(
  "/cliente/:id",
  clienteMiddleware.validateId(Cliente),
  clienteController.deleteCliente
);
module.exports = route;
//# sourceMappingURL=cliente.routes.js.map
