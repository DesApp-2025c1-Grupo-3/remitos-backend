const express = require("express");
const route = express.Router();
const clienteController = require("../controllers/clienteController");
const schemaValidator = require("../middlewares/schemaValidator");
const clienteSchema = require("../schemas/clienteSchema");
//const contactoMiddleware = require("../middlewares/contactoMiddleware");

route.post("/cliente", clienteController.createClienteWithContacto);
//route.get("/contacto/:id", contactoMiddleware.validateContactoId, contactoController.getContactoById)
//route.post("/contacto", schemaValidator(contactoSchema), contactoController.createContacto)
//route.delete("/contacto/:id", contactoMiddleware.validateContactoId, contactoController.deleteContacto)

module.exports = route;
