import express from 'express';
import usuarios from './usuarios';
import comidas from './comidas';
import productos from './productos';
import ciudades from './ciudades';
import compras from './compras';

const router = express.Router();

// definición de un endpoint todo-en-uno
router.get('/saludo', (_req, res) => {
  res.json({ saludo: 'hola' });
});

// definición de un endpoint todo-en-uno
router.get('/respuesta', (req, res) => {
  const paraQuien = req.query.paraQuien;
  res.json({
    hayAlguien: !!paraQuien,
    respuesta: paraQuien ? `cómo va ${paraQuien}` : 'nada para decir',
  });
});

// práctica habitual: delegar en routers individuales
// para cada módulo
router.use('/api/comidas', comidas);
router.use('/api/usuarios', usuarios);
router.use('/api/productos', productos);
router.use('/api/ciudades', ciudades);
router.use('/api/compras', compras);

export default router;
