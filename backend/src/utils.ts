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

const MAX_FILE_SIZE = 15728640; // 15Mb

export const validateUploadedFile = (file: Express.Multer.File): string | null => {
  if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return 'Only .xlsx files are supported';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File is too large. Max size is 15MB.';
  }

  return null;
};
