import express from 'express';

import { withErrorHandling } from './utils';
import {
  showCiudades,
  showUnaCiudad,
} from '../controllers/ciudades_controller';

const router = express.Router();

router.get('/', withErrorHandling(showCiudades));
router.get('/:idCiudad', withErrorHandling(showUnaCiudad));

export default router;
