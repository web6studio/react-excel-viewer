import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { FileUpload } from "../components/FileUpload";
import { useUploadFile } from "../hooks/useUploadFile";
import { useGetFileData } from "../hooks/useGetFileData";

// AgGridReact styling
ModuleRegistry.registerModules([AllCommunityModule]);

const PAGE_SIZE = 100;

const Home = () => {
  const [fileId, setFileId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const {
    mutate: uploadFile,
    isPending: isUploading,
    error: uploadError,
  } = useUploadFile();

  const {
    data: file,
    isLoading: isFetching,
    error: fetchError,
  } = useGetFileData(fileId, page, PAGE_SIZE);

  const handleFileUpload = (file: File) => {
    uploadFile(file, {
      onSuccess: ({ id }) => {
        setFileId(id);
        setPage(1);
      },
    });
  };

  const error = uploadError || fetchError;
  const loading = isUploading || isFetching;
  const totalPages = file ? Math.ceil(file.total / PAGE_SIZE) : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center md:p-4">
      <div
        className={`w-full ${
          file ? "max-w-6xl" : "max-w-xl"
        } bg-white shadow-xl md:rounded-2xl p-8 transition-all duration-300 text-center`}
      >
        <header className="mb-7">
          <h1 className="text-4xl font-bold text-gray-800 uppercase mt-4">
            Excel Viewer
          </h1>
          <p className="text-gray-600 mt-6">
            Upload an excel file to explore its contents
          </p>
        </header>

        <FileUpload onFileSelected={handleFileUpload} disabled={loading} />

        {error && (
          <div className="mt-6 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 text-sm shadow-sm">
            {(error as Error).message || "Something went wrong"}
          </div>
        )}

        {loading && (
          <div className="mt-8 relative animate-pulse">
            <div className="h-[580px] bg-gray-100 rounded-xl border border-gray-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}

        {file && !loading && (
          <div className="mt-8">
            <div style={{ height: "580px", width: "100%" }}>
              <AgGridReact
                rowData={file.rows}
                columnDefs={file.columns
                  .filter((col: ColumnDef) => col.key !== "_id")
                  .map((col: ColumnDef) => ({
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
              />
            </div>

            <div className="mt-6 flex justify-center gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
