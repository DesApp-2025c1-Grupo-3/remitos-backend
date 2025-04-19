import Compra from '../models/compras';

/*
 * proveedor / fecha / precio / cantidad / ProductoId
 */
export const addCompra = async (req, res) => {
  const datosDeLaCompra = req.body;
  const dbResponseCompra = await Compra.create(datosDeLaCompra);

  res.json({ dbResponseCompra });
};

export const getCompras = async (req, res) => {
  const compras = await Compra.findAll({ include: 'Producto' });
  res.json(compras.map((compra) => compra.toJSON()));
};
