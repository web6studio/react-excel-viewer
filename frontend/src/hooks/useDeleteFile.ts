import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFileById } from "../api/files";

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFileById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
};
