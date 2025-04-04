import { useQuery } from "@tanstack/react-query";
import { fetchFileList } from "../api/files";

export const useGetFiles = () => {
  return useQuery({
    queryKey: ["files"],
    queryFn: fetchFileList,
  });
};
