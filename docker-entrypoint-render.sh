#!/bin/sh

# Función para esperar la base de datos
wait_for_db() {
  echo "⏳ Esperando a que la base de datos esté lista..."
  # En Render, la base de datos puede tardar más en estar lista
  sleep 15
  echo "✅ Base de datos lista"
}

# Ejecutar migraciones usando nuestro script personalizado
run_migrations() {
  echo "🔄 Ejecutando migraciones..."
  node scripts/migrate-prod.js || echo "⚠️  Algunas migraciones fallaron"
}

# Ejecutar seeds de normalización
run_seeds() {
  echo "🌱 Ejecutando seeds de normalización..."
  node scripts/seed-prod.js || echo "⚠️  Algunos seeds fallaron"
}

# Ejecutar funciones
wait_for_db
run_migrations
run_seeds

# Iniciar la aplicación
echo "🚀 Iniciando aplicación..."
exec "$@"
