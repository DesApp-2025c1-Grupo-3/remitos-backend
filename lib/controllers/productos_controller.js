import sequelize from 'sequelize';
import Producto from '../models/productos';
import { maxBy, omit, pick } from 'lodash';
import Compra from '../models/compras';

export const getProducto = async (req, res) => {
  const productId = req.params.id;
  const product = await Producto.findByPk(productId, { include: 'Compras' });
  if (product) {
    res.json(product.toJSON());
  } else {
    res.status(404).json({ message: `Producto ${productId} no encontrado` });
  }
};

// filtra el BE
export const getTodosLosProductos1 = async (req, res) => {
  const proveedor = req.query.proveedor;
  let products = await Producto.findAll({});

  if (proveedor) {
    products = products.filter((prod) => prod.proveedor === proveedor);
  }

  // si no hay productos, que devuelva la lista vacia
  res.json(products.map((product) => product.toJSON()));
};

// filtra la BD
export const getTodosLosProductos2 = async (req, res) => {
  const proveedorSolicitado = req.query.proveedor;
  const conCompras = req.query.compras;
  const queryOptions = {};
  if (proveedorSolicitado) {
    queryOptions.where = {
      proveedor: { [sequelize.Op.like]: `%${proveedorSolicitado}%` },
    };
    // en SQL : WHERE proveedor LIKE %<valor>%

    // where: { proveedor: proveedorSolicitado } }
    // en SQL : WHERE proveedor = <valor>
  }
  if (conCompras === 'true') {
    queryOptions.include = 'Compras';
  }
  let products = await Producto.findAll(queryOptions);

  // si no hay productos, que devuelva la lista vacia
  res.json(products.map((product) => product.toJSON()));
};

// acá no hay 404 porque de última si no hay productos
// se devuelve la lista vacía y listo
export const getProductosConUltimaCompra = async (_req, res) => {
  let productsDB = await Producto.findAll({ include: 'Compras' });

  const productsConUltimaCompra = productsDB.map((productDB) => {
    const product = productDB.toJSON();
    // primero le quito "Compras"
    const productConUltimaCompra = omit(product, ['Compras']);
    // ahora le agrego "ultimaCompra"
    if (product.Compras.length > 0) {
      productConUltimaCompra.ultimaCompra = maxBy(product.Compras, 'fecha');
    }
    return productConUltimaCompra;
  });

  res.json(productsConUltimaCompra);
};

/*
 * codigo / nombre / proveedor / precio
 */
export const addProductoSolo = async (req, res) => {
  const datosDelProducto = req.body;

  // creo el producto
  // paso 1 - creo la instancia, esto no va a la base
  // const producto = Producto.build(datosDelProducto);
  // paso 2 - mando el INSERT
  // const dbResponseProducto = await producto.save();

  // lo mismo pero abreviado
  const dbResponseProducto = await Producto.create(datosDelProducto);

  res.json({ dbResponseProducto });
};

/*
 * Endpoint con más de una modificación en la BD: se insertan un producto y una compra.
 * Queda como ejemplo de que la relación entre endpoints y operaciones de BD no tiene por qué ser uno-a-uno.
 * Va en dos versiones
 *
 * codigo / nombre / proveedor / precio / fecha / cantidad
 */
export const addProductoConCompra = async (req, res) => {
  const productoConCompraData = req.body;
  const datosDelProducto = pick(productoConCompraData, [
    'codigo',
    'nombre',
    'precio',
    'proveedor',
  ]);
  const datosDeLaCompra = pick(productoConCompraData, [
    'precio',
    'proveedor',
    'fecha',
    'precio',
    'cantidad',
  ]);

  // primero creo el producto
  const producto = Producto.build(datosDelProducto);
  const dbResponseProducto = await producto.save();

  // completo el id del producto en la compra y creo la compra - la única forma que encontré
  datosDeLaCompra.ProductoId = dbResponseProducto.id;
  const compra = Compra.build(datosDeLaCompra);
  const dbResponseCompra = await compra.save();

  res.json({ producto: dbResponseProducto, compra: dbResponseCompra });
};

export const addProductoConCompra2 = async (req, res) => {
  const productoConCompraData = req.body;
  const datosDelProducto = pick(productoConCompraData, [
    'codigo',
    'nombre',
    'precio',
    'proveedor',
  ]);
  const datosDeLaCompra = pick(productoConCompraData, [
    'precio',
    'proveedor',
    'fecha',
    'precio',
    'cantidad',
  ]);
  const productoConCompraParaCreate = {
    ...datosDelProducto,
    Compras: [datosDeLaCompra],
  };

  const dbResponse = await Producto.create(productoConCompraParaCreate, {
    include: ['Compras'],
  });

  // en este caso no anda build + save, *hay* que hacerlo usando create
  // ver en https://sequelize.org/v5/class/lib/model.js~Model.html
  // que el save no acepta include entre los options
  // const productoConCompra = Producto.build(productoConCompraParaCreate);
  // const dbResponse = await productoConCompra.save({ include: ['Compras'] });

  res.json(dbResponse);
};
