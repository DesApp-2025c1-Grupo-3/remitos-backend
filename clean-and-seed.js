const { execSync } = require("child_process");
const path = require("path");

console.log("🧹 Limpiando base de datos...");

try {
  // Deshacer todos los seeders
  console.log("Deshaciendo seeders...");
  execSync("npx sequelize-cli db:seed:undo:all", { stdio: "inherit" });

  console.log("✅ Seeders deshechos correctamente");

  // Ejecutar seeders en orden
  console.log("\n🌱 Ejecutando seeders con datos distribuidos en el tiempo...");

  console.log("1. Ejecutando seeder de estados...");
  execSync(
    "npx sequelize-cli db:seed --seed 20250101000000-initial-estados.js",
    { stdio: "inherit" }
  );

  console.log("2. Ejecutando seeder de clientes...");
  execSync("npx sequelize-cli db:seed --seed 20250101000001-demo-clientes.js", {
    stdio: "inherit",
  });

  console.log("3. Ejecutando seeder de destinos...");
  execSync("npx sequelize-cli db:seed --seed 20250101000002-demo-destinos.js", {
    stdio: "inherit",
  });

  console.log("4. Ejecutando seeder de contactos...");
  execSync(
    "npx sequelize-cli db:seed --seed 20250101000003-demo-contactos.js",
    { stdio: "inherit" }
  );

  console.log("5. Ejecutando seeder de mercaderías y remitos...");
  execSync(
    "npx sequelize-cli db:seed --seed 20250101000004-demo-mercaderias-remitos.js",
    { stdio: "inherit" }
  );

  console.log("\n✅ ¡Base de datos limpiada y reseedada exitosamente!");
  console.log("\n📊 Resumen de datos creados:");
  console.log("- Estados: 4");
  console.log("- Clientes: 30 (distribuidos en el último año)");
  console.log("- Destinos: 30 (distribuidos en el último año)");
  console.log("- Contactos: ~90 (distribuidos en el último año)");
  console.log("- Mercaderías: 15");
  console.log("- Remitos: 44 (distribuidos en los últimos 6 meses)");
  console.log(
    "\n🎯 Los filtros de fechas ahora funcionarán correctamente con datos distribuidos en el tiempo"
  );
} catch (error) {
  console.error("❌ Error durante el proceso:", error.message);
  process.exit(1);
}
