import { useState } from "react";
import { FileUpload } from "../components/FileUpload";
import { FileList } from "../components/FileList";
import { Modal } from "../components/Modal";
import { FileGridPreview } from "../components/FileGridPreview";
import { useUploadFile } from "../hooks/useUploadFile";
import { useGetFileData } from "../hooks/useGetFileData";

const PAGE_SIZE = 100;

const Home = () => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const { data: file } = useGetFileData(selectedFileId, page, PAGE_SIZE);

  const handleFileUpload = (file: File) => {
    uploadFile(file, {
      onSuccess: ({ id }) => {
        setSelectedFileId(id);
        setPage(1);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-6">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 pl-3 text-gray-500 text-3xl tracking-wide font-semibold animate-pulse">
            Loading...
          </p>
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 uppercase">
          Excel Viewer
        </h1>
        <p className="text-gray-600 mt-6 text-lg">
          Upload an Excel file to explore its contents
        </p>
      </header>

      <FileUpload onFileSelected={handleFileUpload} />

      <div className="mt-15 w-full max-w-2xl">
        <FileList
          selectedId={selectedFileId}
          onSelect={(id: string) => {
            setSelectedFileId(id);
            setPage(1);
          }}
        />
      </div>

      {selectedFileId && file && (
        <Modal
          onClose={() => setSelectedFileId(null)}
          title={file.originalName}
        >
          <FileGridPreview file={file} page={page} setPage={setPage} />
        </Modal>
      )}
    </div>
  );
};

export default Home;
