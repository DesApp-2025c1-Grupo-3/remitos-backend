import express from 'express';

import { addCompra, getCompras } from '../controllers/compras_controller';
import { withErrorHandling } from './utils';

const router = express.Router();
router.post('/', withErrorHandling(addCompra));
router.get('/', withErrorHandling(getCompras));
export default router;
