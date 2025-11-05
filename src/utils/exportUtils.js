import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToExcel(rows, filename = 'matters.xlsx', sheetName = 'Matters') {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { ok: false, reason: 'no_rows' };
  }
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
  return { ok: true };
}

export function exportToPdf(rows, filename = 'matters.pdf', options = {}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { ok: false, reason: 'no_rows' };
  }

  const doc = new jsPDF({
    orientation: options.orientation || 'landscape',
    unit: options.unit || 'pt',
    format: options.format || 'a4',
  });

  const keys = Object.keys(rows[0] ?? {});
  const limitedKeys = (options.columns && options.columns.length
    ? options.columns
    : keys
  ).slice(0, options.maxColumns ?? 12);

  const head = [limitedKeys];
  const body = rows.map((r) =>
    limitedKeys.map((k) => {
      const val = r[k];
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') {
        try {
          return JSON.stringify(val);
        } catch (_e) {
          return '[object]';
        }
      }
      return String(val);
    })
  );

  autoTable(doc, {
    head,
    body,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [17, 24, 39] },
  });

  doc.save(filename);
  return { ok: true };
}


