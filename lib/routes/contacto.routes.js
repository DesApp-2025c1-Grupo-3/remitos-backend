const express = require("express");
const route = express.Router();
const contactoController = require("../controllers/contactoController");
const schemaValidator = require("../middlewares/schemaValidator");
const contactoSchema = require("../schemas/contactoSchema");
const contactoMiddleware = require("../middlewares/contactoMiddleware");

//Trae todos los contactos
route.get("/contacto", contactoController.getContacto);
//Trae contacto por ID
route.get(
  "/contacto/:id",
  contactoMiddleware.validateContactoId,
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
  contactoMiddleware.validateContactoId,
  contactoController.deleteContacto
);

module.exports = route;
