'use strict';

const express = require('express');
const router = express.Router();
const tipoEmpresaController = require('../controllers/tipoEmpresaController');
// const schemaValidator = require('../middlewares/schemaValidator');
// const tipoEmpresaSchema = require('../schemas/tipoEmpresaSchema');

// Middleware de debug
router.use((req, res, next) => {
  console.log(`[TipoEmpresa] ${req.method} ${req.path}`);
  next();
});

// Endpoint de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'TipoEmpresa routes funcionando correctamente' });
});

// Obtener todos los tipos de empresa
router.get('/', tipoEmpresaController.getAll);

// Obtener un tipo de empresa por ID
router.get('/:id', (req, res) => {
  res.json({ message: `GET /${req.params.id} - Tipo de empresa por ID` });
});

// Crear nuevo tipo de empresa
router.post('/', (req, res) => {
  res.json({ message: 'POST / - Crear tipo de empresa', body: req.body });
});

// Actualizar tipo de empresa
router.put('/:id', (req, res) => {
  res.json({ message: `PUT /${req.params.id} - Actualizar tipo de empresa`, body: req.body });
});

// Eliminar tipo de empresa (soft delete)
router.delete('/:id', (req, res) => {
  res.json({ message: `DELETE /${req.params.id} - Eliminar tipo de empresa` });
});

module.exports = router;
