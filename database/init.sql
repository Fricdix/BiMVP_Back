-- BI MVP Database Schema

USE bd6rmqvtjfxjgkrvsrcw;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


-- Tabla: User (Usuarios del sistema)
CREATE TABLE IF NOT EXISTS `User` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('USER', 'ANALYST', 'ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

select * from User;

-- Tabla: KpiDaily (KPIs diarios del negocio)
CREATE TABLE IF NOT EXISTS `KpiDaily` (
  `id` varchar(255) NOT NULL,
  `date` datetime(3) NOT NULL UNIQUE,
  `sales` int NOT NULL,
  `growthPct` double NOT NULL,
  `conversion` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `KpiDaily_date_key` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Product (Productos)
CREATE TABLE IF NOT EXISTS `Product` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `priceUsd` double DEFAULT NULL,
  `marketDemand` int NOT NULL DEFAULT 0,
  `businessScore` double NOT NULL DEFAULT 0,
  `level` varchar(255) NOT NULL DEFAULT 'Estándar',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Influencer (Influenciadores)
CREATE TABLE IF NOT EXISTS `Influencer` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `platform` enum('TIKTOK', 'YOUTUBE', 'INSTAGRAM', 'TWITTER') NOT NULL,
  `country` varchar(255) NOT NULL DEFAULT 'Ecuador',
  `followers` int NOT NULL DEFAULT 0,
  `engagementPct` double NOT NULL DEFAULT 0,
  `score` int NOT NULL DEFAULT 0,
  `level` enum('ALTO', 'MEDIO', 'BAJO') NOT NULL DEFAULT 'MEDIO',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Report (Reportes)
CREATE TABLE IF NOT EXISTS `Report` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `fromDate` datetime(3) NOT NULL,
  `toDate` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdById` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Report_createdById_idx` (`createdById`),
  CONSTRAINT `Report_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: ReportMetric (Métricas de Reportes)
CREATE TABLE IF NOT EXISTS `ReportMetric` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` int NOT NULL,
  `reportId` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ReportMetric_reportId_idx` (`reportId`),
  CONSTRAINT `ReportMetric_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `Report` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Recommendation (Recomendaciones de influenciadores)
CREATE TABLE IF NOT EXISTS `Recommendation` (
  `id` varchar(255) NOT NULL,
  `matchScore` int NOT NULL DEFAULT 0,
  `note` varchar(255) NOT NULL DEFAULT '',
  `productId` varchar(255) NOT NULL,
  `influencerId` varchar(255) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Recommendation_productId_idx` (`productId`),
  KEY `Recommendation_influencerId_idx` (`influencerId`),
  CONSTRAINT `Recommendation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Recommendation_influencerId_fkey` FOREIGN KEY (`influencerId`) REFERENCES `Influencer` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
