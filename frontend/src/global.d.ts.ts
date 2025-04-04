declare global {
  interface FileResponse {
    id: string;
    originalName: string;
    createdAt: string;
    updatedAt: string;
    userId: string | null;
  }

  type ColumnDef = { key: string; label: string };
  type ExcelRowData = Record<string, string | number | boolean | null>;
}

export {};
