import { Router } from "express";
import PDFDocument from "pdfkit";
import { prisma } from "../lib/prisma";
import { getAuthCookieExpress, verifySessionToken } from "../lib/auth-express";

const router = Router();

async function requireSession(req: any, res: any) {
  const token = getAuthCookieExpress(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    return await verifySessionToken(token);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function toCsv(rows: any[]) {
  const header = [
    "id",
    "title",
    "category",
    "createdAt",
    "createdBy",
    "metricCount",
  ];
  const escape = (v: any) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return '"' + s.replaceAll('"', '""') + '"';
    }
    return s;
  };
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.title,
        r.category,
        new Date(r.createdAt).toISOString(),
        r.createdBy?.email ?? "",
        r.metrics?.length ?? 0,
      ]
        .map(escape)
        .join(","),
    );
  }
  return lines.join("\n");
}

async function pdfBuffer(rows: any[]) {
  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (d) => chunks.push(Buffer.from(d)));

  doc.fontSize(18).text("Reporte Exportado (BI Dashboard)", { align: "left" });
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .fillColor("#334155")
    .text(`Generado: ${new Date().toLocaleString("es-EC")}`);
  doc.moveDown(1);
  doc.fillColor("#0f172a");

  for (const r of rows) {
    doc.fontSize(12).text(`${r.title}  (${r.category})`);
    doc.fontSize(10).fillColor("#475569").text(`ID: ${r.id}`);
    doc.text(`Fecha: ${new Date(r.createdAt).toLocaleDateString("es-EC")}`);
    doc.text(`Autor: ${r.createdBy?.name ?? ""} (${r.createdBy?.email ?? ""})`);
    doc.moveDown(0.25);

    if (r.metrics?.length) {
      doc.fillColor("#0f172a").text("Metricas:", { underline: true });
      doc.fillColor("#0f172a");
      for (const m of r.metrics) {
        doc.text(`- ${m.name}: ${m.value}`);
      }
    }

    doc.moveDown(0.75);
    doc.moveTo(doc.x, doc.y).lineTo(560, doc.y).strokeColor("#e2e8f0").stroke();
    doc.moveDown(0.75);
    doc.fillColor("#0f172a");
  }

  doc.end();

  await new Promise<void>((resolve) => doc.on("end", () => resolve()));
  return Buffer.concat(chunks);
}

router.get("/", async (req, res) => {
  const session = await requireSession(req, res);
  if (!session) return;

  const from = (req.query.from as string) || undefined;
  const to = (req.query.to as string) || undefined;
  const category = (req.query.category as string) || undefined;

  const where: any = {};
  if (category && category !== "all") where.category = category;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const reports = await prisma.report.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      metrics: true,
      createdBy: { select: { name: true, email: true } },
    },
  });

  const categories = await prisma.report.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });

  return res.json({
    reports,
    categories: categories.map((c) => c.category),
  });
});

router.get("/export", async (req, res) => {
  const session = await requireSession(req, res);
  if (!session) return;

  const format = String(req.query.format || "csv").toLowerCase();
  const from = (req.query.from as string) || undefined;
  const to = (req.query.to as string) || undefined;
  const category = (req.query.category as string) || undefined;

  const where: any = {};
  if (category && category !== "all") where.category = category;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const rows = await prisma.report.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      metrics: true,
      createdBy: { select: { name: true, email: true } },
    },
  });

  if (format === "pdf") {
    const buf = await pdfBuffer(rows);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="reportes.pdf"');
    return res.send(buf);
  }

  const csv = toCsv(rows);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="reportes.csv"');
  return res.send(csv);
});

export default router;
