const express = require('express');
const router = express.Router();
const tipoEmpresaController = require('../controllers/tipoEmpresaController');
const { validateTipoEmpresa, validateTipoEmpresaId } = require('../middlewares/tipoEmpresaMiddleware');

// GET /api/tipos-empresa - Obtener todos los tipos de empresa
router.get('/', tipoEmpresaController.getTiposEmpresa);

// GET /api/tipos-empresa/:id - Obtener un tipo de empresa por ID
router.get('/:id', validateTipoEmpresaId, tipoEmpresaController.getTipoEmpresaById);

// POST /api/tipos-empresa - Crear un nuevo tipo de empresa
router.post('/', validateTipoEmpresa, tipoEmpresaController.createTipoEmpresa);

// PUT /api/tipos-empresa/:id - Actualizar un tipo de empresa
router.put('/:id', validateTipoEmpresaId, validateTipoEmpresa, tipoEmpresaController.updateTipoEmpresa);

// DELETE /api/tipos-empresa/:id - Eliminar un tipo de empresa
router.delete('/:id', validateTipoEmpresaId, tipoEmpresaController.deleteTipoEmpresa);

module.exports = router;
