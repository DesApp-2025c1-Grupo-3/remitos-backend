const express = require('express');
const router = express.Router();
const tipoMercaderiaController = require('../controllers/tipoMercaderiaController');
const { validateTipoMercaderia, validateTipoMercaderiaId } = require('../middlewares/tipoMercaderiaMiddleware');

// GET /api/tipos-mercaderia - Obtener todos los tipos de mercadería
router.get('/', tipoMercaderiaController.getTiposMercaderia);

// GET /api/tipos-mercaderia/:id - Obtener un tipo de mercadería por ID
router.get('/:id', validateTipoMercaderiaId, tipoMercaderiaController.getTipoMercaderiaById);

// POST /api/tipos-mercaderia - Crear un nuevo tipo de mercadería
router.post('/', validateTipoMercaderia, tipoMercaderiaController.createTipoMercaderia);

// PUT /api/tipos-mercaderia/:id - Actualizar un tipo de mercadería
router.put('/:id', validateTipoMercaderiaId, validateTipoMercaderia, tipoMercaderiaController.updateTipoMercaderia);

// DELETE /api/tipos-mercaderia/:id - Eliminar un tipo de mercadería
router.delete('/:id', validateTipoMercaderiaId, tipoMercaderiaController.deleteTipoMercaderia);

module.exports = router;
