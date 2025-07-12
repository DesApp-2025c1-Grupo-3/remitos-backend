const express = require("express");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const remitoController = require("../controllers/remitoController");
const schemaValidator = require("../middlewares/schemaValidator");
const remitoMiddleware = require("../middlewares/remitoMiddleware");
const remitoSchema = require("../schemas/remitoSchema");
const upload = require("../middlewares/upload");

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "El archivo es demasiado grande. Máximo 5MB.",
      });
    }
    return res.status(400).json({
      error: "Error al subir el archivo.",
    });
  } else if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
  next();
};

//Trae todos los remitos
route.get("/remito", remitoController.getRemitos);
//Trae remito por id
route.get(
  "/remito/:id",
  remitoMiddleware.validateRemitoId,
  remitoController.getRemitoById
);
//CREA SOLO EL MODELO REMITO CON SUS ATRIBUTOS
route.post(
  "/remito",
  upload.single("archivoAdjunto"),
  handleMulterError,
  schemaValidator(remitoSchema),
  remitoMiddleware.validateNumeroAsignadoUnico,
  remitoController.createRemito
);
//CREA EL REMITO CON DESTINO Y SU CONTACTO Y CLIENTE Y SU CONTACTO
route.post(
  "/remitoFinal",
  upload.single("archivoAdjunto"),
  handleMulterError,
  //schemaValidator(remitoSchema),
  remitoMiddleware.validateNumeroAsignadoUnico,
  remitoController.createRemitoWithClienteAndDestino
);
//Edita remito
route.put(
  "/remito/:id",
  remitoMiddleware.validateRemitoId,
  remitoMiddleware.validateNumeroAsignadoUnicoUpdate,
  remitoController.updateRemito
);
//Edita estado de un remito
route.put("/remito/:id/estado/:eid", remitoController.updateEstadoRemito);

//Borra remito
route.delete(
  "/remito/:id",
  remitoMiddleware.validateRemitoId,
  remitoController.deleteRemito
);

route.get(
  "/reportes/volumen-por-cliente-periodo",
  remitoController.getVolumenPorClientePeriodo
);

// Endpoint para servir archivos de manera segura
route.get("/archivo/:filename", (req, res) => {
  const { filename } = req.params;

  // Validar que el nombre del archivo sea seguro
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return res.status(400).json({ error: "Nombre de archivo inválido" });
  }

  const filePath = path.join(__dirname, "../../uploads/remitos", filename);

  // Verificar que el archivo existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Archivo no encontrado" });
  }

  res.sendFile(filePath);
});

module.exports = route;
