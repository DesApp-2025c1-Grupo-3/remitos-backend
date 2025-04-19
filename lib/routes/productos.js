import express from 'express';
import {
  addProductoConCompra,
  addProductoSolo,
  getProducto,
  getProductosConUltimaCompra,
  getTodosLosProductos2,
} from '../controllers/productos_controller';

import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(getTodosLosProductos2));
router.get('/conUltimaCompra', withErrorHandling(getProductosConUltimaCompra));
router.get('/:id', withErrorHandling(getProducto));
router.post('/', withErrorHandling(addProductoSolo));
router.post('/con-compra', withErrorHandling(addProductoConCompra));

export default router;
