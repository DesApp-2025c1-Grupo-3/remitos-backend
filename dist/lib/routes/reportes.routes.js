const express = require("express");

const router = express.Router();

const reportesController = require("../controllers/reportesController"); // Volumen total de mercadería por cliente/período

router.get(
  "/volumen-por-cliente",
  reportesController.getVolumenPorClientePeriodo
); // Distribución geográfica de orígenes y destinos

router.get(
  "/distribucion-geografica",
  reportesController.getDistribucionGeografica
); // Valor declarado por tipo de mercadería

router.get(
  "/valor-por-tipo-mercaderia",
  reportesController.getValorPorTipoMercaderia
);
module.exports = router;
//# sourceMappingURL=reportes.routes.js.map
