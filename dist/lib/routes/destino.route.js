const express = require("express");

const route = express.Router();

const destinoController = require("../controllers/destinoController");

const schemaValidator = require("../middlewares/schemaValidator");

const destinoSchema = require("../schemas/destinoSchema");

const destinoContactoSchema = require("../schemas/destinoContactoSchema");

const destinoMiddleware = require("../middlewares/destinoMiddleware");

const middleware = require("../middlewares/estadoMiddleware"); //Trae todos los destinos


route.get("/destino", destinoController.getDestino); //Trae destino por ID

route.get("/destino/:id", destinoMiddleware.validateDestinoId, destinoController.getDestinoById); //Trae destinos filtrados

route.get("/destinoFiltrado", destinoMiddleware.validarFiltroDestino, destinoController.getDestinoFiltrado); //Crea un cliente

route.post("/destino", schemaValidator(destinoSchema), destinoController.createDestino); //Crea un cliente y asocia un cliente que tambien crea

route.post("/destinoContacto", schemaValidator(destinoContactoSchema), destinoController.createDestinoWithContacto); //Edita un destino

route.put("/destino/:id", schemaValidator(destinoSchema), destinoMiddleware.validateDestinoId, destinoController.updateDestino); //Borra un destino

route.delete("/destino/:id", destinoMiddleware.validateDestinoId, destinoController.deleteDestino);
module.exports = route;
//# sourceMappingURL=destino.route.js.map