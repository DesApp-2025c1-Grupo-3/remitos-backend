const express = require("express");
const route = express.Router();
const { Contacto } = require("../models");
const contactoController = require("../controllers/contactoController");
const schemaValidator = require("../middlewares/schemaValidator");
const contactoSchema = require("../schemas/contactoSchema");
const contactoMiddleware = require("../middlewares/validateMiddleware");

//Trae todos los contactos
route.get("/contacto", contactoController.getContacto);
//Trae contacto por ID
route.get(
  "/contacto/:id",
  contactoMiddleware.validateId(Contacto),
  contactoController.getContactoById
);
//Crea un contacto
route.post(
  "/contacto",
  schemaValidator(contactoSchema),
  contactoController.createContacto
);

route.put(
  "/contacto/:id",
  schemaValidator(contactoSchema),
  contactoController.updateContacto
);

//Borra un contacto
route.delete(
  "/contacto/:id",
  contactoMiddleware.validateId(Contacto),
  contactoController.deleteContacto
);

module.exports = route;
