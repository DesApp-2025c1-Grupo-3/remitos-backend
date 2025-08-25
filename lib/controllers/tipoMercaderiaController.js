const { TipoMercaderia } = require("../models");
const controller = {};

const getTiposMercaderia = async (req, res) => {
    const tiposMercaderia = await TipoMercaderia.findAll();
    res.status(200).json(tiposMercaderia);
};
controller.getTiposMercaderia = getTiposMercaderia;

const getTipoMercaderiaById = async (req, res) => {
    const id = req.params.id;
    const tipoMercaderia = await TipoMercaderia.findByPk(id);
    res.status(200).json(tipoMercaderia);
};
controller.getTipoMercaderiaById = getTipoMercaderiaById;

const createTipoMercaderia = async (req, res) => {
    const { descripcion } = req.body;
    const tipoMercaderia = await TipoMercaderia.create({ descripcion });
    res.status(201).json(tipoMercaderia);
};
controller.createTipoMercaderia = createTipoMercaderia;

const updateTipoMercaderia = async (req, res) => {
    const id = req.params.id;
    const { descripcion } = req.body;
    const tipoMercaderia = await TipoMercaderia.findByPk(id);
    await tipoMercaderia.update({ descripcion });
    res.status(200).json(tipoMercaderia);
};
controller.updateTipoMercaderia = updateTipoMercaderia;

const deleteTipoMercaderia = async (req, res) => {
    const id = req.params.id;
    const tipoMercaderia = await TipoMercaderia.findByPk(id);
    await tipoMercaderia.destroy();
    res.status(200).json({ message: "Tipo de mercadería eliminado correctamente" });
};
controller.deleteTipoMercaderia = deleteTipoMercaderia;

module.exports = controller;
