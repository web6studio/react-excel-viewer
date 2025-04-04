import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../api/files";

export const useUploadFile = () =>
  useMutation({
    mutationFn: uploadFile,
  });
