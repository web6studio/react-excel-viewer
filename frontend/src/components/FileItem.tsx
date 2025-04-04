import { Trash2 } from "lucide-react";
import { useDeleteFile } from "../hooks/useDeleteFile";

type FileItemProps = {
  file: { id: string; originalName: string; createdAt: string };
  isSelected: boolean;
  onClick: () => void;
};

export const FileItem = ({ file, isSelected, onClick }: FileItemProps) => {
  const { mutate: deleteFile, isPending } = useDeleteFile();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteFile(file.id);
  };

  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between px-5 py-4 mb-2 rounded-lg overflow-hidden border cursor-pointer shadow-xs transition
        ${
          isSelected
            ? "bg-blue-50 border-blue-500"
            : "bg-white border-gray-300 hover:bg-gray-50"
        }
      `}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-1 pr-4 gap-1 text-left">
        <p className="text-sm sm:text-base font-medium text-gray-800 truncate">
          {file.originalName}
        </p>
        <p className="text-xs text-gray-500 whitespace-nowrap sm:text-sm">
          {new Date(file.createdAt).toLocaleString()}
        </p>
      </div>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-gray-700 hover:text-red-500 disabled:text-gray-400 p-2 transition-colors cursor-pointer"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
