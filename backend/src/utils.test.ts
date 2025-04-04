import * as XLSX from 'xlsx';
import { parseExcel, validateUploadedFile } from './utils';

describe('parseExcel', () => {
  it('should parse valid Excel data', () => {
    // Create a simple Excel buffer
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Name', 'Age'],
      ['John', 30],
      ['Jane', 25],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const result = parseExcel(buffer);

    expect(result.columns).toEqual([
      { key: 'Name', label: 'Name' },
      { key: 'Age', label: 'Age' },
    ]);
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toMatchObject({
      Name: 'John',
      Age: 30,
    });
    expect(result.rows[1]).toMatchObject({
      Name: 'Jane',
      Age: 25,
    });
  });

  it('should handle empty Excel data', () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const result = parseExcel(buffer);

    expect(result.columns).toEqual([]);
    expect(result.rows).toEqual([]);
  });

  it('should handle invalid buffer', () => {
    const invalidBuffer = Buffer.from('invalid data');
    const result = parseExcel(invalidBuffer);

    expect(result.columns).toEqual([]);
    expect(result.rows).toEqual([]);
  });
});

describe('validateUploadedFile', () => {
  it('should accept valid .xlsx file', () => {
    const validFile = {
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 1000000, // 1MB
    } as Express.Multer.File;

    expect(validateUploadedFile(validFile)).toBeNull();
  });

  it('should reject invalid file type', () => {
    const invalidFile = {
      mimetype: 'text/plain',
      size: 1000000,
    } as Express.Multer.File;

    expect(validateUploadedFile(invalidFile)).toBe('Only .xlsx files are supported');
  });

  it('should reject file exceeding size limit', () => {
    const largeFile = {
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 16000000, // 16MB
    } as Express.Multer.File;

    expect(validateUploadedFile(largeFile)).toBe('File is too large. Max size is 15MB.');
  });
});
