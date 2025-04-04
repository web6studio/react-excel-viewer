import * as XLSX from "xlsx";

export type ColumnDef = { key: string; label: string };
export type ExcelRowData = Record<string, string | number | boolean | null>;

export interface ParsedExcelData {
  columns: ColumnDef[];
  rows: Array<{ _id: string } & ExcelRowData>;
}

// TODO: Replace with a MongoDB compatible ID?
const generateId = () => crypto.randomUUID();

export const parseExcelFile = async (file: File): Promise<ParsedExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const raw = XLSX.utils.sheet_to_json(sheet, {
          defval: "",
        }) as ExcelRowData[];

        const rows = raw.map((row) => ({
          _id: generateId(),
          ...row,
        }));

        const columns = Object.keys(rows[0] || {}).map((key) => ({
          key,
          label: key,
        }));

        resolve({ columns, rows });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
