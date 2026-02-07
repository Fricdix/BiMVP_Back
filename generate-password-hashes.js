#!/usr/bin/env node

/**
 * CREDENCIALES DE PRUEBA - BI MVP
 *
 * Las contraseñas se almacenan en texto plano para desarrollo
 * Ver database/seed.sql para detalles
 */

console.log("\n╔════════════════════════════════════════════════════════╗");
console.log("║   Credenciales de Prueba - BI MVP                      ║");
console.log("╚════════════════════════════════════════════════════════╝\n");

const users = [
  { email: "admin@demo.com", password: "admin123", role: "ADMIN" },
  { email: "analyst@demo.com", password: "analyst123", role: "ANALYST" },
  { email: "user@demo.com", password: "user123", role: "USER" },
];

console.log("Usuarios disponibles para login:\n");
users.forEach((user) => {
  console.log(`📧 ${user.email}`);
  console.log(`🔑 Contraseña: ${user.password}`);
  console.log(`👤 Rol: ${user.role}`);
  console.log("");
});

console.log("✅ Estas credenciales están cargadas en la BD");
