const express = require("express");

const route = express.Router();

const destinoController = require("../controllers/destinoController");

const schemaValidator = require("../middlewares/schemaValidator"); //const clienteSchema = require("../schemas/clienteSchema");

const destinoMiddleware = require("../middlewares/destinoMiddleware");

route.get("/destino", destinoController.getDestino);
route.get("/destino/:id", destinoController.getDestino); //Crea un cliente

route.post("/destino", destinoController.createDestino); //Crea un cliente y asocia un cliente que tambien crea

route.post("/destinoContacto", destinoController.createDestinoWithContacto);
route.put("/destino/:id", destinoController.updateDestino);
route.delete("/destino/:id", destinoController.deleteDestino);
module.exports = route;
//# sourceMappingURL=destino.route.js.map
