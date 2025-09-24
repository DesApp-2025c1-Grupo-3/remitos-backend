const express = require('express');
const router = express.Router();
const emailDestinatarioController = require('../controllers/emailDestinatarioController');

// GET /api/email-destinatarios - Obtener todos los destinatarios activos
router.get('/', emailDestinatarioController.getEmailDestinatarios);

// POST /api/email-destinatarios - Crear nuevo destinatario
router.post('/', emailDestinatarioController.createEmailDestinatario);

// PUT /api/email-destinatarios/:id - Actualizar destinatario
router.put('/:id', emailDestinatarioController.updateEmailDestinatario);

// DELETE /api/email-destinatarios/:id - Eliminar destinatario (desactivar)
router.delete('/:id', emailDestinatarioController.deleteEmailDestinatario);

module.exports = router;
