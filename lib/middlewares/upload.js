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

// Configurar filtro de archivos
const fileFilter = (req, file, cb) => {
  // Permitir solo imágenes y PDFs
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, JPG, PNG, GIF) y PDFs."
      ),
      false
    );
  }
};

// Configurar límites
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB máximo
};

module.exports = multer({
  storage,
  fileFilter,
  limits,
});

///PERMITE CARGAR ARCHIVO EN ARCHIVO ADJUNTO
