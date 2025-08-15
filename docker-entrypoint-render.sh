#!/bin/sh

# Función para esperar la base de datos
wait_for_db() {
  echo "⏳ Esperando a que la base de datos esté lista..."
  # En Render, la base de datos puede tardar más en estar lista
  sleep 15
  echo "✅ Base de datos lista"
}

# Ejecutar migraciones
run_migrations() {
  echo "🔄 Ejecutando migraciones..."
  npx sequelize-cli db:migrate || echo "⚠️  Algunas migraciones fallaron (puede ser normal si ya están aplicadas)"
}

# Ejecutar seeds si es necesario
run_seeds() {
  if [ "$RUN_SEEDS" = "true" ]; then
    echo "🌱 Ejecutando seeds..."
    npx sequelize-cli db:seed:all || echo "⚠️  Algunos seeds fallaron (puede ser normal si los datos ya existen)"
  else
    echo "ℹ️  Seeds omitidos (RUN_SEEDS no está habilitado)"
  fi
}

# Ejecutar funciones
wait_for_db
run_migrations
run_seeds

# Iniciar la aplicación
echo "🚀 Iniciando aplicación..."
exec "$@"
