import { useRef } from "react";

type FileUploadProps = {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
};

export const FileUpload = ({ onFileSelected, disabled }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelected(file);
            e.target.value = ""; // Clear the input value after selection
          }
        }}
      />
      <button
        className={`
          px-6 py-3 rounded-md text-white transition
          ${
            disabled
              ? "bg-blue-200 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md"
          }
        `}
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Upload Excel File
      </button>
    </>
  );
};
