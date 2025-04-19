const ciudadesFijas = [
  { id: 1, nombre: 'Buenos Aires', pais: 'Argentina', poblacion: 14000000 },
  { id: 2, nombre: 'Rosario', pais: 'Argentina', poblacion: 3200000 },
  { id: 3, nombre: 'Graniti', pais: 'Italia', poblacion: 1000 },
  {
    id: 4,
    nombre: { es: 'Marsella', fr: 'Marseille' },
    pais: 'Francia',
    poblacion: 2300000,
  },
  {
    id: 5,
    nombre: { es: 'Ginebra', fr: 'Genève', en: 'Geneva' },
    pais: 'Suiza',
    poblacion: 1030000,
  },
  { id: 6, nombre: 'Cachi', pais: 'Argentina', poblacion: 2500 },
];

export const showCiudades = async (req, res) => {
  const pais = req.query.pais;
  const poblacion = req.query.poblacion;
  const idioma = req.headers.idioma;
  if (
    Object.keys(req.query).some(
      (queryParam) => !['pais', 'poblacion'].includes(queryParam)
    )
  ) {
    res.status(400);
    res.json({ message: 'Sólo se puede filtrar por: pais / poblacion' });
  }
  console.log({ pais, poblacion, masUno: Number(poblacion) + 1 });
  let resultado = ciudadesFijas;
  if (pais) {
    resultado = resultado.filter((ciudad) => ciudad.pais === pais);
  }
  if (poblacion) {
    resultado = resultado.filter(
      (ciudad) => ciudad.poblacion > Number(poblacion)
    );
  }
  if (idioma) {
    resultado = resultado.map((ciudad) => {
      const nombreEnElIdioma =
        ciudad.nombre[idioma] || ciudad.nombre.es || ciudad.nombre;
      return { ...ciudad, nombre: nombreEnElIdioma };
    });
  }
  res.json(resultado);
};

export const showUnaCiudad = async (req, res) => {
  const id = Number(req.params.idCiudad);
  // si me pasaron algo que no es un número
  if (isNaN(id)) {
    res.status(400);
    res.json({ message: `El id ${req.params.idCiudad} no es numérico` });
  }

  // acá ya sé que id es un número
  const ciudad = ciudadesFijas.find((ciudad) => ciudad.id === id);
  // si hay una ciudad con el id pedido
  if (ciudad) {
    res.json(ciudad);
    // si no
  } else {
    res.status(404);
    res.json({ message: `No se encontró una ciudad con id ${id}` });
  }
};
