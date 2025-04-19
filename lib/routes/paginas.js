import express from 'express';
import { withErrorHandling } from './utils';

const paginaDeSaludo = async (req, res) => {
  res.send(`
<html>
    <body>
        <h1>Hola gente</h1>
        <div style="margin-top: 2rem;">cómo va</div>
    </body>
</html>
    `);
};

const router = express.Router();
router.get('/hola', withErrorHandling(paginaDeSaludo));

export default router;
