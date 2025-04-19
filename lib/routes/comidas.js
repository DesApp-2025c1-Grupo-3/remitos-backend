import express from 'express';
import {
  getCarnes,
  showPasta,
  showPescado,
} from '../controllers/comida_controller';

import { withErrorHandling } from './utils';

const routerParaComidas = express.Router();

// como el routerParaComidas se va a enganchar con el router principal
// en el path /api/comidas,
// esta línea define un get para el endpoint GET /api/comidas/pastas
routerParaComidas.get('/pastas', withErrorHandling(showPasta));

// otros dos endpoints GET
routerParaComidas.get('/pescados', withErrorHandling(showPescado));
routerParaComidas.get('/carnes/:gramos', withErrorHandling(getCarnes));

export default routerParaComidas;
