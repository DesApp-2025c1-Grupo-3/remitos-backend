const express = require("express");
const route = express.Router();
const estadoController = require("../controllers/estadoController");
const schemaValidator = require("../middlewares/schemaValidator");
const estadoSchema = require("../schemas/estadoSchema");
const estadoMiddleware = require("../middlewares/estadoMiddleware");

route.get("/", estadoController.getEstado);
route.get(
  "/:id",
  estadoMiddleware.validateEstadoId,
  estadoController.getEstadoById
);
route.post("/", schemaValidator(estadoSchema), estadoController.createEstado);

module.exports = route;
