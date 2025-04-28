const express = require("express");

const route = express.Router();

const contactoController = require("../controllers/contactoController");

const schemaValidator = require("../middlewares/schemaValidator");

const contactoSchema = require("../schemas/contactoSchema");

const contactoMiddleware = require("../middlewares/contactoMiddleware");

route.get("/contacto", contactoController.getContacto);
route.get(
  "/contacto/:id",
  contactoMiddleware.validateContactoId,
  contactoController.getContactoById
);
route.post(
  "/contacto",
  schemaValidator(contactoSchema),
  contactoController.createContacto
);
route.delete(
  "/contacto/:id",
  contactoMiddleware.validateContactoId,
  contactoController.deleteContacto
);
module.exports = route;
//# sourceMappingURL=contacto.routes.js.map
