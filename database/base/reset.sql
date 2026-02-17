-- BI MVP Database - RESET SCRIPT
-- CUIDADO: Este script ELIMINA TODOS LOS DATOS
-- USE SOLO SI NECESITAS EMPEZAR DE NUEVO
-- 
-- Pasos:
-- 1. Ejecuta este archivo en MySQL Workbench
-- 2. Luego ejecuta init.sql para crear tablas nuevas
-- 3. Ejecuta seed.sql para insertar datos de ejemplo

SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar todas las tablas en orden (respeta foreign keys)
DROP TABLE IF EXISTS `Recommendation`;
DROP TABLE IF EXISTS `ReportMetric`;
DROP TABLE IF EXISTS `Report`;
DROP TABLE IF EXISTS `Product`;
DROP TABLE IF EXISTS `Influencer`;
DROP TABLE IF EXISTS `KpiDaily`;
DROP TABLE IF EXISTS `User`;

SET FOREIGN_KEY_CHECKS = 1;

-- Verificar que todo se eliminó
SELECT 'Tablas eliminadas correctamente' AS mensaje;
SELECT 
  COUNT(*) as tabla_count 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'bd6rmqvtjfxjgkrvsrcw' 
  AND TABLE_NAME IN ('User', 'KpiDaily', 'Product', 'Influencer', 'Report', 'ReportMetric', 'Recommendation');

-- Resultado esperado: 0 tablas (porque se eliminaron)

COMMIT;
