import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { FileUpload } from "./components/FileUpload";
import { parseExcelFile, ParsedExcelData } from "./utils";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// AgGridReact styling
ModuleRegistry.registerModules([AllCommunityModule]);

const App = () => {
  const [data, setData] = useState<ParsedExcelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const parsed = await parseExcelFile(file);
      setData(parsed);
    } catch (err) {
      console.error("Error parsing Excel:", err);
      setError("Failed to parse Excel file. Please try a different file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center md:p-4 text-center">
      <div
        className={`w-full ${
          data ? "max-w-6xl" : "max-w-xl"
        } bg-white shadow-xl  md:rounded-2xl p-8 transition-all duration-300`}
      >
        <header className="mb-7">
          <h1 className="text-4xl font-bold text-gray-800 uppercase mt-4">
            Excel Viewer
          </h1>
          <p className="text-gray-500 mt-6">
            Upload an excel file to explore its contents
          </p>
        </header>

        <FileUpload onFileSelected={handleFileUpload} disabled={loading} />

        {error && (
          <div className="mt-6 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 text-sm shadow-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-8 animate-pulse">
            <div className="h-[580px] bg-gray-100 rounded-xl border border-gray-200" />
          </div>
        )}

        {data && !loading && (
          <div className="mt-8">
            <div
              className="ag-theme-alpine rounded-xl"
              style={{ height: "580px", width: "100%" }}
            >
              <AgGridReact
                rowData={data.rows}
                columnDefs={data.columns
                  .filter((col) => col.key !== "_id")
                  .map((col) => ({
                    field: col.key,
                    headerName: col.label,
                    sortable: true,
                    filter: true,
                    resizable: true,
                  }))}
                defaultColDef={{
                  flex: 1,
                  minWidth: 120,
                  editable: true,
                }}
                pagination={true}
                paginationPageSize={100}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
