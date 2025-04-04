import { describe, it, expect, vi } from "vitest";
import { parseExcelFile } from "./utils";
import * as XLSX from "xlsx";

// Mock XLSX
vi.mock("xlsx", () => ({
  read: vi.fn(() => ({
    SheetNames: ["Sheet1"],
    Sheets: {
      Sheet1: {},
    },
  })),
  utils: {
    sheet_to_json: vi.fn(() => [
      { name: "John", age: 30 },
      { name: "Jane", age: 25 },
    ]),
  },
}));

describe("parseExcelFile", () => {
  it("should parse valid Excel data", async () => {
    const mockFile = new File(["dummy"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const result = await parseExcelFile(mockFile);

    expect(result.columns).toContainEqual({ key: "_id", label: "_id" });
    expect(result.columns).toContainEqual({ key: "name", label: "name" });
    expect(result.columns).toContainEqual({ key: "age", label: "age" });

    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toMatchObject({ name: "John", age: 30 });
    expect(result.rows[1]).toMatchObject({ name: "Jane", age: 25 });
  });

  it("should handle empty data", async () => {
    vi.mocked(XLSX.utils.sheet_to_json).mockReturnValueOnce([]);

    const mockFile = new File(["dummy"], "empty.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const result = await parseExcelFile(mockFile);
    expect(result.rows).toEqual([]);
    expect(result.columns).toEqual([]);
  });

  it("should handle FileReader errors", async () => {
    const mockFile = new File(["dummy"], "error.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Mock FileReader to simulate an error
    const originalFileReader = global.FileReader;
    class ErrorFileReader extends FileReader {
      readAsArrayBuffer() {
        const event = new ProgressEvent("error") as ProgressEvent<FileReader>;
        this.onerror?.(event);
      }
    }
    global.FileReader = ErrorFileReader;

    await expect(parseExcelFile(mockFile)).rejects.toThrow();

    // Restore original FileReader
    global.FileReader = originalFileReader;
  });
});
