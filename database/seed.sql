-- BI MVP Database SEED DATA

USE bd6rmqvtjfxjgkrvsrcw;

-- Insertar Usuarios de Prueba
-- Contraseñas simples para pruebas:
-- admin@demo.com    → admin123
-- analyst@demo.com  → analyst123
-- user@demo.com     → user123

INSERT INTO `User` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('user_admin_001', 'Administrador Sistema', 'admin@demo.com', 'admin123', 'ADMIN', NOW(), NOW()),
('user_analyst_001', 'Analista BI', 'analyst@demo.com', 'analyst123', 'ANALYST', NOW(), NOW()),
('user_regular_001', 'Usuario Normal', 'user@demo.com', 'user123', 'USER', NOW(), NOW());

-- Insertar KPIs Diarios
INSERT INTO `KpiDaily` (`id`, `date`, `sales`, `growthPct`, `conversion`, `createdAt`) VALUES
('kpi_20260201', '2026-02-01 00:00:00.000', 15000, 5.2, 3.8, NOW()),
('kpi_20260202', '2026-02-02 00:00:00.000', 18500, 6.5, 4.2, NOW()),
('kpi_20260203', '2026-02-03 00:00:00.000', 16200, 4.8, 3.9, NOW()),
('kpi_20260204', '2026-02-04 00:00:00.000', 19800, 8.1, 4.5, NOW()),
('kpi_20260205', '2026-02-05 00:00:00.000', 21500, 9.3, 4.8, NOW()),
('kpi_20260206', '2026-02-06 00:00:00.000', 20100, 7.5, 4.6, NOW());



-- Insertar Productos
INSERT INTO `Product` (`id`, `name`, `category`, `priceUsd`, `marketDemand`, `businessScore`, `level`, `createdAt`, `updatedAt`) VALUES
('prod_001', 'Laptop Premium', 'Electrónica', 1299.99, 85, 8.5, 'Premium', NOW(), NOW()),
('prod_002', 'Smartphone Gama Alta', 'Electrónica', 899.99, 92, 9.1, 'Premium', NOW(), NOW()),
('prod_003', 'Tablet 10 pulgadas', 'Electrónica', 499.99, 65, 7.2, 'Estándar', NOW(), NOW()),
('prod_004', 'Headphones Inalámbricos', 'Accesorios', 199.99, 78, 7.8, 'Estándar', NOW(), NOW()),
('prod_005', 'Smartwatch Deportivo', 'Wearables', 299.99, 72, 7.5, 'Estándar', NOW(), NOW()),
('prod_006', 'Cámara Digital 4K', 'Fotografía', 1199.99, 55, 8.0, 'Premium', NOW(), NOW()),
('prod_007', 'Monitor Gaming 144Hz', 'Accesorios', 349.99, 68, 7.4, 'Estándar', NOW(), NOW()),
('prod_008', 'Teclado Mecánico RGB', 'Accesorios', 149.99, 81, 7.9, 'Estándar', NOW(), NOW());



-- Insertar Influenciadores
INSERT INTO `Influencer` (`id`, `name`, `platform`, `country`, `followers`, `engagementPct`, `score`, `level`, `createdAt`, `updatedAt`) VALUES
('inf_001', 'TechJavier', 'TIKTOK', 'Ecuador', 450000, 8.5, 95, 'ALTO', NOW(), NOW()),
('inf_002', 'ProduTuber', 'YOUTUBE', 'Ecuador', 320000, 7.2, 82, 'ALTO', NOW(), NOW()),
('inf_003', 'InstaTech', 'INSTAGRAM', 'Ecuador', 280000, 6.8, 78, 'ALTO', NOW(), NOW()),
('inf_004', 'GadgetsMiguel', 'YOUTUBE', 'Ecuador', 185000, 5.9, 65, 'MEDIO', NOW(), NOW()),
('inf_005', 'EditorialTweets', 'TWITTER', 'Ecuador', 95000, 4.2, 52, 'MEDIO', NOW(), NOW()),
('inf_006', 'UnicornTech', 'TIKTOK', 'Ecuador', 156000, 5.5, 61, 'MEDIO', NOW(), NOW()),
('inf_007', 'RandomGamer', 'YOUTUBE', 'Ecuador', 78000, 3.8, 45, 'BAJO', NOW(), NOW()),
('inf_008', 'PixelArtista', 'INSTAGRAM', 'Ecuador', 62000, 3.2, 38, 'BAJO', NOW(), NOW());

-- Insertar Recomendaciones (Influenciador x Producto)
INSERT INTO `Recommendation` (`id`, `matchScore`, `note`, `productId`, `influencerId`, `createdAt`) VALUES
('rec_001', 92, 'Excelente match para audiencia tech', 'prod_001', 'inf_001', NOW()),
('rec_002', 88, 'Alto engagement en contenido de productos electrónicos', 'prod_002', 'inf_001', NOW()),
('rec_003', 85, 'Buen alcance para smartphones', 'prod_002', 'inf_002', NOW()),
('rec_004', 79, 'Audiencia interesada en accesorios', 'prod_004', 'inf_003', NOW()),
('rec_005', 75, 'Contenido relacionado a gadgets', 'prod_001', 'inf_003', NOW()),
('rec_006', 82, 'Fuerte en review de electrónica', 'prod_006', 'inf_002', NOW()),
('rec_007', 68, 'Nicho gamer bien posicionado', 'prod_007', 'inf_004', NOW()),
('rec_008', 70, 'Comunidad tech activa', 'prod_005', 'inf_006', NOW()),
('rec_009', 65, 'Audiencia en crecimiento', 'prod_003', 'inf_004', NOW()),
('rec_010', 58, 'Potencial medio para expansión', 'prod_008', 'inf_005', NOW());

-- Insertar Reportes de Ejemplo
INSERT INTO `Report` (`id`, `title`, `category`, `fromDate`, `toDate`, `createdAt`, `createdById`) VALUES
('rep_001', 'Análisis de Ventas Enero 2026', 'Ventas', '2026-01-01 00:00:00.000', '2026-01-31 23:59:59.999', NOW(), 'user_analyst_001'),
('rep_002', 'Reporte de Influenciadores Activos', 'Marketing', '2026-02-01 00:00:00.000', '2026-02-06 23:59:59.999', NOW(), 'user_analyst_001'),
('rep_003', 'KPI de Conversión Semanal', 'Operaciones', '2026-02-01 00:00:00.000', '2026-02-06 23:59:59.999', NOW(), 'user_admin_001');

-- Insertar Métricas de Reportes
INSERT INTO `ReportMetric` (`id`, `name`, `value`, `reportId`) VALUES
('met_001', 'Total Ventas', 90997, 'rep_001'),
('met_002', 'Número de Transacciones', 1245, 'rep_001'),
('met_003', 'Ticket Promedio', 73, 'rep_001'),
('met_004', 'Influenciadores Asociados', 8, 'rep_002'),
('met_005', 'Total Recomendaciones', 10, 'rep_002'),
('met_006', 'Tasa Conversión Promedio', 4.3, 'rep_003'),
('met_007', 'Crecimiento Semana Anterior', 7.2, 'rep_003');

-- Verificación Final
-- Descomenta para verificar que todo se insertó correctamente:
/*
SELECT 'Users' as tabla, COUNT(*) as total FROM `User` 
UNION ALL
SELECT 'KpiDaily', COUNT(*) FROM `KpiDaily`
UNION ALL
SELECT 'Products', COUNT(*) FROM `Product`
UNION ALL
SELECT 'Influencers', COUNT(*) FROM `Influencer`
UNION ALL
SELECT 'Recommendations', COUNT(*) FROM `Recommendation`
UNION ALL
SELECT 'Reports', COUNT(*) FROM `Report`
UNION ALL
SELECT 'ReportMetrics', COUNT(*) FROM `ReportMetric`;
*/

COMMIT;