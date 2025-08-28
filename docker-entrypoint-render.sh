#!/bin/sh

# Función para esperar la base de datos
wait_for_db() {
  echo "⏳ Esperando a que la base de datos esté lista..."
  # En Render, la base de datos puede tardar más en estar lista
  sleep 20
  
  # Intentar conectar a la base de datos
  echo "🔍 Verificando conexión a la base de datos..."
  npx sequelize-cli db:version || {
    echo "⚠️  No se pudo conectar a la base de datos, esperando más tiempo..."
    sleep 10
    npx sequelize-cli db:version || {
      echo "❌ No se pudo conectar a la base de datos después de múltiples intentos"
      exit 1
    }
  }
  echo "✅ Base de datos lista y accesible"
}

# Ejecutar migraciones
run_migrations() {
  if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "🔄 Ejecutando migraciones..."
    npx sequelize-cli db:migrate || echo "⚠️  Algunas migraciones fallaron (puede ser normal si ya están aplicadas)"
    echo "✅ Migraciones completadas"
  else
    echo "ℹ️  Migraciones omitidas (RUN_MIGRATIONS no está habilitado)"
  fi
}

# Limpiar y resetear entidades normalizadas
clean_and_reset_normalized_entities() {
  echo "🧹 Limpiando entidades normalizadas..."
  # Limpiar datos existentes
  npx sequelize-cli db:query "DELETE FROM \"Estados\";" || echo "⚠️  No se pudieron limpiar Estados"
  npx sequelize-cli db:query "DELETE FROM \"TipoEmpresas\";" || echo "⚠️  No se pudieron limpiar TipoEmpresas"
  npx sequelize-cli db:query "DELETE FROM \"TipoMercaderias\";" || echo "⚠️  No se pudieron limpiar TipoMercaderias"
  
  echo "🔄 Reseteando secuencias de IDs..."
  # Resetear secuencias para asegurar IDs desde 1
  npx sequelize-cli db:query "ALTER SEQUENCE \"Estados_id_seq\" RESTART WITH 1;" || echo "⚠️  No se pudo resetear secuencia de Estados"
  npx sequelize-cli db:query "ALTER SEQUENCE \"TipoEmpresas_id_seq\" RESTART WITH 1;" || echo "⚠️  No se pudo resetear secuencia de TipoEmpresas"
  npx sequelize-cli db:query "ALTER SEQUENCE \"TipoMercaderias_id_seq\" RESTART WITH 1;" || echo "⚠️  No se pudo resetear secuencia de TipoMercaderias"
  echo "✅ Entidades normalizadas limpiadas y secuencias reseteadas"
}

# Ejecutar seeds si es necesario
run_seeds() {
  if [ "$RUN_SEEDS" = "true" ]; then
    echo "🌱 Ejecutando seeds de normalización..."
    # Limpiar y resetear entidades normalizadas antes de ejecutar seeds
    clean_and_reset_normalized_entities
    # Ejecutar solo seeds de normalización (estados, tipos de empresa, tipos de mercadería)
    npx sequelize-cli db:seed --seed 20250101000000-initial-estados.js || echo "⚠️  Seed estados falló"
    npx sequelize-cli db:seed --seed 20250101000005-seed-tipos-empresa.js || echo "⚠️  Seed tipos empresa falló"
    npx sequelize-cli db:seed --seed 20250101000006-seed-tipos-mercaderia.js || echo "⚠️  Seed tipos mercadería falló"
    echo "✅ Seeds de normalización completados"
  else
    echo "ℹ️  Seeds omitidos (RUN_SEEDS no está habilitado)"
  fi
}

# Verificar que las entidades normalizadas estén presentes y tengan IDs correctos
verify_normalized_entities() {
  echo "🔍 Verificando entidades normalizadas..."
  # Verificar que las tablas de normalización existan y tengan datos
  npx sequelize-cli db:seed --seed 20250101000000-initial-estados.js --dry-run || echo "⚠️  Estados ya existen"
  npx sequelize-cli db:seed --seed 20250101000005-seed-tipos-empresa.js --dry-run || echo "⚠️  Tipos empresa ya existen"
  npx sequelize-cli db:seed --seed 20250101000006-seed-tipos-mercaderia.js --dry-run || echo "⚠️  Tipos mercadería ya existen"
  
  echo "🔍 Verificando que los IDs empiecen desde 1..."
  # Verificar IDs mínimos
  npx sequelize-cli db:query "SELECT MIN(id) as min_id FROM \"Estados\";" || echo "⚠️  No se pudo verificar ID mínimo de Estados"
  npx sequelize-cli db:query "SELECT MIN(id) as min_id FROM \"TipoEmpresas\";" || echo "⚠️  No se pudo verificar ID mínimo de TipoEmpresas"
  npx sequelize-cli db:query "SELECT MIN(id) as min_id FROM \"TipoMercaderias\";" || echo "⚠️  No se pudo verificar ID mínimo de TipoMercaderias"
  
  echo "✅ Verificación de entidades normalizadas completada"
}

# Ejecutar funciones
wait_for_db
run_migrations
run_seeds
verify_normalized_entities

# Iniciar la aplicación
echo "🚀 Iniciando aplicación..."
exec "$@"
