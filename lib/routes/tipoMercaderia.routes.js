'use strict';

const express = require('express');
const router = express.Router();
const tipoMercaderiaController = require('../controllers/tipoMercaderiaController');
// const schemaValidator = require('../middlewares/schemaValidator');
// const tipoMercaderiaSchema = require('../schemas/tipoMercaderiaSchema');

// Middleware de debug
router.use((req, res, next) => {
  console.log(`[TipoMercaderia] ${req.method} ${req.path}`);
  next();
});

// Endpoint de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'TipoMercaderia routes funcionando correctamente' });
});

// Obtener todos los tipos de mercadería
router.get('/', tipoMercaderiaController.getAll);

// Obtener un tipo de mercadería por ID
router.get('/:id', (req, res) => {
  res.json({ message: `GET /${req.params.id} - Tipo de mercadería por ID` });
});

// Crear nuevo tipo de mercadería
router.post('/', (req, res) => {
  res.json({ message: 'POST / - Crear tipo de mercadería', body: req.body });
});

// Actualizar tipo de mercadería
router.put('/:id', (req, res) => {
  res.json({ message: `PUT /${req.params.id} - Actualizar tipo de mercadería`, body: req.body });
});

// Eliminar tipo de mercadería (soft delete)
router.delete('/:id', (req, res) => {
  res.json({ message: `DELETE /${req.params.id} - Eliminar tipo de mercadería` });
});

module.exports = router;
