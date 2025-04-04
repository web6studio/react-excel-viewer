import { useGetFiles } from "../hooks/useGetFiles";
import { FileItem } from "./FileItem";

type FileListProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export const FileList = ({ selectedId, onSelect }: FileListProps) => {
  const { data: files, isLoading, error } = useGetFiles();

  if (isLoading)
    return <p className="text-gray-500 text-center">Loading files...</p>;
  if (error)
    return <p className="text-red-500 text-center">Failed to load files</p>;

  return (
    <>
      {files?.map((file: FileResponse) => (
        <FileItem
          key={file.id}
          file={file}
          isSelected={file.id === selectedId}
          onClick={() => onSelect(file.id)}
        />
      ))}
    </>
  );
};
