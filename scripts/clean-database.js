const { sequelize } = require("../lib/models");

async function cleanDatabase() {
  try {
    console.log("🧹 Limpiando base de datos...");

    // Obtener todas las tablas del esquema público
    const tables = await sequelize.query(
      `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'pg_%' 
      AND tablename NOT LIKE 'sql_%'
      ORDER BY tablename;
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    // Desactivar restricciones de clave foránea temporalmente
    await sequelize.query("SET session_replication_role = replica;");

    // Limpiar cada tabla
    for (const table of tables) {
      const tableName = table.tablename;
      console.log(`🗑️  Limpiando tabla: ${tableName}`);
      await sequelize.query(`TRUNCATE TABLE "${tableName}" CASCADE;`);
    }

    // Reactivar restricciones de clave foránea
    await sequelize.query("SET session_replication_role = DEFAULT;");

    console.log("✅ Base de datos limpiada exitosamente");
  } catch (error) {
    console.error("❌ Error al limpiar la base de datos:", error);
  } finally {
    await sequelize.close();
  }
}

cleanDatabase();
