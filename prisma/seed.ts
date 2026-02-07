import { PrismaClient, Role, Platform, InfluenceLevel } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  await prisma.recommendation.deleteMany();
  await prisma.influencer.deleteMany();
  await prisma.product.deleteMany();

  await prisma.reportMetric.deleteMany();
  await prisma.report.deleteMany();
  await prisma.kpiDaily.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@demo.com",
      role: Role.ADMIN,
      passwordHash: await bcrypt.hash("Admin123*", 10),
    },
  });

  const analyst = await prisma.user.create({
    data: {
      name: "Analista",
      email: "analista@demo.com",
      role: Role.ANALYST,
      passwordHash: await bcrypt.hash("Analyst123*", 10),
    },
  });

  await prisma.user.create({
    data: {
      name: "Usuario",
      email: "usuario@demo.com",
      role: Role.USER,
      passwordHash: await bcrypt.hash("User123*", 10),
    },
  });

  const today = new Date();
  const start = subDays(today, 29);

  const kpis = Array.from({ length: 30 }).map((_, i) => {
    const date = addDays(start, i);
    return {
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      sales: 8000 + i * 180 + Math.round(Math.sin(i / 4) * 250),
      growthPct: Number((1.2 + Math.sin(i / 6) * 1.2).toFixed(2)),
      conversion: Number((1.6 + Math.cos(i / 7) * 0.6).toFixed(2)),
    };
  });

  await prisma.kpiDaily.createMany({ data: kpis });

  const categories = [
    "Smartphones",
    "Laptops",
    "Tablets",
    "Audio",
    "Wearables",
    "Gaming",
    "Componentes",
    "Drones",
    "Cámaras",
  ];

  function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  for (let i = 0; i < 18; i++) {
    const category = categories[i % categories.length];
    const fromDate = subDays(today, rand(40, 90));
    const toDate = subDays(today, rand(1, 10));

    await prisma.report.create({
      data: {
        title: `Reporte de Mercado (Ecuador) — ${category}`,
        category,
        fromDate,
        toDate,
        createdById: i % 2 === 0 ? admin.id : analyst.id,
        metrics: {
          create: [
            { name: "Productos analizados", value: rand(8, 25) },
            { name: "Demanda de mercado", value: rand(60, 98) },
            { name: "Precio promedio (USD)", value: rand(120, 1500) },
            { name: "Nivel de competencia", value: rand(40, 95) },
            { name: "Oportunidad", value: rand(50, 95) },
          ],
        },
      },
    });
  }

  await prisma.product.createMany({
    data: [
      {
        name: "PlayStation 5",
        category: "Gaming",
        priceUsd: 499,
        marketDemand: 92,
        businessScore: 110.4,
        level: "Premium",
      },
      {
        name: "Sony WH-1000XM5",
        category: "Audio",
        priceUsd: 349,
        marketDemand: 85,
        businessScore: 102,
        level: "Premium",
      },
      {
        name: "Apple Watch Series 9",
        category: "Wearables",
        priceUsd: 399,
        marketDemand: 82,
        businessScore: 98.4,
        level: "Premium",
      },
      {
        name: "GoPro Hero 12",
        category: "Cámaras",
        priceUsd: 399,
        marketDemand: 68,
        businessScore: 81.6,
        level: "Premium",
      },
      {
        name: "iPhone 15 Pro Max",
        category: "Smartphones",
        priceUsd: 1199,
        marketDemand: 95,
        businessScore: 76,
        level: "Estándar",
      },
    ],
  });

  const productRows = await prisma.product.findMany();

  await prisma.influencer.createMany({
    data: [
      {
        name: "TechTikEC",
        platform: Platform.TIKTOK,
        followers: 520000,
        engagementPct: 8.1,
        score: 69,
        level: InfluenceLevel.ALTO,
        country: "Ecuador",
      },
      {
        name: "GamerGuayaquil",
        platform: Platform.TIKTOK,
        followers: 340000,
        engagementPct: 7.2,
        score: 58,
        level: InfluenceLevel.ALTO,
        country: "Ecuador",
      },
      {
        name: "TechReviewer EC",
        platform: Platform.YOUTUBE,
        followers: 250000,
        engagementPct: 6.5,
        score: 56,
        level: InfluenceLevel.ALTO,
        country: "Ecuador",
      },
      {
        name: "DronesPilotEC",
        platform: Platform.YOUTUBE,
        followers: 28000,
        engagementPct: 6.8,
        score: 48,
        level: InfluenceLevel.ALTO,
        country: "Ecuador",
      },
      {
        name: "MovilEcuador",
        platform: Platform.YOUTUBE,
        followers: 95000,
        engagementPct: 5.8,
        score: 47,
        level: InfluenceLevel.ALTO,
        country: "Ecuador",
      },
    ],
  });

  const influencers = await prisma.influencer.findMany();

  const byName = (n: string) => productRows.find((p) => p.name === n)!.id;
  const infByName = (n: string) => influencers.find((i) => i.name === n)!.id;

  await prisma.recommendation.createMany({
    data: [
      {
        productId: byName("PlayStation 5"),
        influencerId: infByName("TechTikEC"),
        matchScore: 90,
        note: "Excelente coincidencia para campaña nacional (Ecuador).",
      },
      {
        productId: byName("Sony WH-1000XM5"),
        influencerId: infByName("TechTikEC"),
        matchScore: 86,
        note: "Alto engagement y audiencia tech (nivel país).",
      },
      {
        productId: byName("Apple Watch Series 9"),
        influencerId: infByName("TechTikEC"),
        matchScore: 84,
        note: "Buen perfil de audiencia para wearables en Ecuador.",
      },
      {
        productId: byName("PlayStation 5"),
        influencerId: infByName("TechReviewer EC"),
        matchScore: 83,
        note: "YouTube refuerza confianza para compras de alto valor.",
      },
    ],
  });

  console.log("✅ Seed completo Ecuador OK");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
