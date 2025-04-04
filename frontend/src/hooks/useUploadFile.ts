import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "../api/files";

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadFile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
  });
};
