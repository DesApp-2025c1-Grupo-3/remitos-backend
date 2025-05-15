const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  //CREA LA CARPETA
  destination: "uploads/remitos",
  //El nombre del archivo
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nuevoNombre = `remito-${Date.now()}${ext}`;
    cb(null, nuevoNombre);
  },
});
module.exports = multer({
  storage,
}); ///PERMITE CARGAR ARCHIVO EN ARCHIVO ADJUNTO
//# sourceMappingURL=upload.js.map
