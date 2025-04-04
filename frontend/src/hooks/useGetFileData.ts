import { useQuery } from "@tanstack/react-query";
import { fetchFileData } from "../api/files";

export const useGetFileData = (
  fileId: string | null,
  page: number,
  pageSize: number
) =>
  useQuery({
    queryKey: ["fileData", fileId, page],
    queryFn: () => fetchFileData(fileId!, page, pageSize),
    enabled: !!fileId,
    placeholderData: (previousData) => previousData,
  });
