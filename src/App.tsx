import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { parseExcelFile, ParsedExcelData } from "./utils";

const App = () => {
  const [data, setData] = useState<ParsedExcelData | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const parsed = await parseExcelFile(file);
      setData(parsed);
      console.log("Parsed:", parsed);
    } catch (err) {
      console.error("Error parsing Excel:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8">
        <header className="mb-5">
          <h1 className="text-4xl font-bold text-gray-800 uppercase">
            Excel Viewer
          </h1>
          <p className="text-gray-500 mt-6">
            Upload an Excel file to explore its contents
          </p>
        </header>

        <FileUpload onFileSelected={handleFileUpload} />

        {data ? (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-4">
              Parsed <strong>{data.rows.length}</strong> rows and{" "}
              <strong>{data.columns.length}</strong> columns
            </p>
            {/* AG Grid will go here */}
          </div>
        ) : (
          <p className="text-gray-400 mt-5 italic">No file uploaded yet</p>
        )}
      </div>
    </div>
  );
};

export default App;
