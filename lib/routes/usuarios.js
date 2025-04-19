import express from 'express';

import { generateGreeting, index, show, add } from '../controllers/usuario_controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));
router.get('/:id', withErrorHandling(show));
router.get('/pavadas/greeting/:quien', withErrorHandling(generateGreeting));
router.post('/', withErrorHandling(add));
export default router;
