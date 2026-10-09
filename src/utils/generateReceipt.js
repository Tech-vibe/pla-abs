import jsPDF from "jspdf";
import logo from "../assets/logo3.png";
export function generateReceipt({
  material,
  breakdown,
  totalGrams,
  totalCost,
  section,
}) {
  const doc = new jsPDF({ unit: "mm", format: "a5" });
  const W = doc.internal.pageSize.getWidth();
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, "0")} ${
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][now.getMonth()]
  } ${now.getFullYear()}`;

  const hours = now.getHours().toString().padStart(2, "0");
  const mins = now.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${mins}`;

  let y = 14;

  // ── Header ──
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, W, 34, "F");

  // Logo — centered above the title
  doc.addImage(logo, "PNG", W / 2 - 8, 2, 15, 15);

  doc.setTextColor(0, 194, 168);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Tinkerer's Lab", W / 2, 22, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(139, 143, 168);
  doc.text("Filament Usage Receipt", W / 2, 27, { align: "center" });
  doc.text("GEC Idukki", W / 2, 32, { align: "center" });

  y = 42;

  // ── Meta info ──
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");

  doc.text("Date", 14, y);
  doc.setFont("helvetica", "bold");
  doc.text(dateStr, W - 14, y, { align: "right" });

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text("Time", 14, y);
  doc.setFont("helvetica", "bold");
  doc.text(timeStr, W - 14, y, { align: "right" });

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text("Material", 14, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 194, 168);
  doc.text(material, W - 14, y, { align: "right" });

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text("Section", 14, y);
  doc.setFont("helvetica", "bold");
  doc.text(section, W - 14, y, { align: "right" });

  // ── Divider ──
  y += 8;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(14, y, W - 14, y);

  // ── Slab breakdown table header ──
  y += 7;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("SLAB", 14, y);
  doc.text("GRAMS", 70, y, { align: "right" });
  doc.text("RATE", 110, y, { align: "right" });
  doc.text("AMOUNT", W - 14, y, { align: "right" });

  y += 3;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, y, W - 14, y);

  // ── Slab rows ──
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(8.5);

  breakdown.forEach((b) => {
    if (
      !b ||
      b.grams === undefined ||
      b.rate === undefined ||
      b.cost === undefined
    )
      return;
    const label = String(b.label ?? "");
    const grams = String(b.grams.toFixed(2)) + "g";
    const rate = "Rs." + String(b.rate.toFixed(2)) + "/g";
    const amount = "Rs." + String(b.cost.toFixed(2));
    doc.text(label, 14, y);
    doc.text(grams, 70, y, { align: "right" });
    doc.text(rate, 110, y, { align: "right" });
    doc.text(amount, W - 14, y, { align: "right" });
    y += 6.5;
  });

  // ── Subtotal divider ──
  doc.setDrawColor(180, 180, 180);
  doc.line(14, y, W - 14, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8.5);
  doc.text("Total filament used", 14, y);
  doc.setFont("helvetica", "bold");
  doc.text(`${totalGrams.toFixed(2)}g`, W - 14, y, { align: "right" });

  // ── Total cost ──
  y += 8;
  doc.setFillColor(15, 17, 23);
  doc.roundedRect(14, y - 5, W - 28, 12, 2, 2, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(139, 143, 168);
  doc.text("TOTAL AMOUNT", 20, y + 2);

  doc.setFontSize(12);
  doc.setTextColor(0, 194, 168);
  doc.text(`Rs. ${totalCost.toFixed(2)}`, W - 20, y + 2, { align: "right" });

  // ── Footer ──
  y += 20;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(160, 160, 160);
  doc.text("Thank you for using Tinkerer's Lab!", W / 2, y, {
    align: "center",
  });
  doc.text("This is a computer-generated receipt.", W / 2, y + 5, {
    align: "center",
  });

  // ── Save ──
  const fileName = `TinkersLab_Receipt_${material}_${now.getTime()}.pdf`;
  doc.save(fileName);
}
