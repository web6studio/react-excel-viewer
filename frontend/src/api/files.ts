const API_BASE_URL = `${import.meta.env.VITE_API_HOST || "http://localhost"}:${
  import.meta.env.VITE_API_PORT || "8080"
}`;

export const uploadFile = async (file: File): Promise<FileResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/files`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("File upload failed");
  return res.json();
};

export const fetchFileData = async (
  fileId: string,
  page: number,
  pageSize: number
) => {
  const res = await fetch(
    `${API_BASE_URL}/files/${fileId}?page=${page}&pageSize=${pageSize}`
  );
  if (!res.ok) throw new Error("Failed to fetch file data");
  return res.json();
};

export const fetchFileList = async (): Promise<FileResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/files`);
  if (!res.ok) throw new Error("Failed to fetch files");
  return res.json();
};

export const deleteFileById = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/files/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete file");
};
