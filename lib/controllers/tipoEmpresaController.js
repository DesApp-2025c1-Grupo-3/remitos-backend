const { TipoEmpresa } = require("../models");
const controller = {};

const getTiposEmpresa = async (req, res) => {
    const tiposEmpresa = await TipoEmpresa.findAll();
    res.status(200).json(tiposEmpresa);
};
controller.getTiposEmpresa = getTiposEmpresa;

const getTipoEmpresaById = async (req, res) => {
    const id = req.params.id;
    const tipoEmpresa = await TipoEmpresa.findByPk(id);
    res.status(200).json(tipoEmpresa);
};
controller.getTipoEmpresaById = getTipoEmpresaById;

const createTipoEmpresa = async (req, res) => {
    const { descripcion } = req.body;
    const tipoEmpresa = await TipoEmpresa.create({ descripcion });
    res.status(201).json(tipoEmpresa);
};
controller.createTipoEmpresa = createTipoEmpresa;

const updateTipoEmpresa = async (req, res) => {
    const id = req.params.id;
    const { descripcion } = req.body;
    const tipoEmpresa = await TipoEmpresa.findByPk(id);
    await tipoEmpresa.update({ descripcion });
    res.status(200).json(tipoEmpresa);
};
controller.updateTipoEmpresa = updateTipoEmpresa;

const deleteTipoEmpresa = async (req, res) => {
    const id = req.params.id;
    const tipoEmpresa = await TipoEmpresa.findByPk(id);
    if (!tipoEmpresa) {
      return res.status(404).json({ message: "Tipo de empresa no encontrado" });
    }
    await tipoEmpresa.destroy();
    res.status(200).json({ message: "Tipo de empresa eliminado correctamente" });
};
controller.deleteTipoEmpresa = deleteTipoEmpresa;

module.exports = controller;
