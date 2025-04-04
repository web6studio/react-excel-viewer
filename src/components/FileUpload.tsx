import { useRef } from "react";

type FileUploadProps = {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
};

export const FileUpload = ({ onFileSelected, disabled }: FileUploadProps) => {
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
        className={`
          px-4 py-2 rounded text-white 
          ${
            disabled
              ? "bg-blue-200"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }
        `}
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Upload Excel File
      </button>
    </div>
  );
};
