import Usuario from '../models/usuario';

export const index = async (req, res) => {
  const usuarios = await Usuario.findAll({});
  res.json({ data: usuarios.map((usuario) => usuario.toJSON()) });
};

export const show = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (usuario) {
    res.json({ data: usuario.toJSON() });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró un usuario con id ${req.params.id}` });
  }
};

export const generateGreeting = async (req, res) => {
  const destinatario = req.params.quien
  res.json({ saludo: `hola ${destinatario}` });
}

export const add = async (req, res) => {
  const usuarioData = req.body;                 // datos del request, esto lo maneja Express
  const usuario = Usuario.build(usuarioData);   // creo el objeto de modelo, esto lo maneja Sequelize
  const dbResponse = await usuario.save();      // el save lo define sequelize
  // ver doc de Sequelize *versión 5* en https://sequelize.org/v5/class/lib/model.js~Model.html
  res.json(dbResponse);
}
