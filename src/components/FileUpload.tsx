import { useRef } from "react";

type FileUploadProps = {
  onFileSelected: (file: File) => void;
};

export const FileUpload = ({ onFileSelected }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-4">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        Upload Excel File
      </button>
    </div>
  );
};
