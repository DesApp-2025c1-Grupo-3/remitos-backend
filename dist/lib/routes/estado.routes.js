const express = require("express");

const route = express.Router();

const estadoController = require("../controllers/estadoController");

const schemaValidator = require("../middlewares/schemaValidator");

const estadoSchema = require("../schemas/estadoSchema");

const estadoMiddleware = require("../middlewares/estadoMiddleware"); //Trae los estados


route.get("/estado", estadoController.getEstado); //Trae un estado por ID

route.get("/estado/:id", estadoMiddleware.validateEstadoId, estadoController.getEstadoById); //Crea un estado

route.post("/estado", schemaValidator(estadoSchema), estadoController.createEstado); //Edita un estado

route.put("/estado/:id", schemaValidator(estadoSchema), estadoController.updateEstado); //Borra un estado

route.delete("/estado/:id", estadoMiddleware.validateEstadoId, estadoController.deleteEstado);
module.exports = route;
//# sourceMappingURL=estado.routes.js.map