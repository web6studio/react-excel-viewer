import * as XLSX from 'xlsx';
import { ObjectId } from 'mongodb';

export type ColumnDef = { key: string; label: string };
export type ExcelRowData = Record<string, string | number | boolean | null>;

export interface ParsedExcelData {
  columns: ColumnDef[];
  rows: Array<{ _id: ObjectId } & ExcelRowData>;
}

export const parseExcel = (buffer: Buffer): ParsedExcelData => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const raw = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as ExcelRowData[];

  const columns: ColumnDef[] = Object.keys(raw[0] || {}).map((key) => ({
    key,
    label: key,
  }));

  const rows = raw.map((row) => ({
    _id: new ObjectId(),
    ...row,
  })) as ParsedExcelData['rows'];

  return { columns, rows };
};
