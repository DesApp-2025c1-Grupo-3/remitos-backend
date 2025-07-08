const express = require("express");

const route = express.Router();

const mercaderiaController = require("../controllers/mercaderiaController");

const {
  TipoMercaderia
} = require("../models"); //const schemaValidator = require("../middlewares/schemaValidator");
//const clienteSchema = require("../schemas/clienteSchema");
//const clienteMiddleware = require("../middlewares/clienteMiddleware");


route.get("/mercaderias", mercaderiaController.getMercaderia);
route.get("/mercaderias/:id", //clienteMiddleware.validateClienteId,
mercaderiaController.getMercaderiaById); //Crea un cliente

route.post("/mercaderias", //schemaValidator(clienteSchema),
mercaderiaController.createMercaderia); //Crea un cliente y asocia un cliente que tambien crea

route.put("/mercaderias/:id", //schemaValidator(clienteSchema),
mercaderiaController.updateMercaderia); //Borra un cliente

route.delete("/mercaderias/:id", //clienteMiddleware.validateClienteId,
mercaderiaController.deleteMercaderia); // Endpoint temporal para ver todos los tipos de mercadería

route.get("/tipos-mercaderia", async (req, res) => {
  try {
    const tipos = await TipoMercaderia.findAll();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener tipos de mercadería"
    });
  }
});
module.exports = route;
//# sourceMappingURL=mercaderia.routes.js.map