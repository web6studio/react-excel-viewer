type PaginationProps = {
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
};

export const Pagination = ({ page, setPage, totalPages }: PaginationProps) => {
  return (
    <div className="mt-8 flex justify-center gap-2">
      <button
        className={`px-4 py-2 rounded-md text-white text-sm shadow-md transition
          ${
            page <= 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-400 hover:bg-gray-500 cursor-pointer"
          }`}
        disabled={page <= 1}
        onClick={() => setPage((p: number) => Math.max(p - 1, 1))}
      >
        Previous
      </button>
      <span className="px-4 py-2 text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        className={`px-4 py-2 rounded-md text-white text-sm shadow-md transition
          ${
            page >= totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-400 hover:bg-gray-500 cursor-pointer"
          }`}
        disabled={page >= totalPages}
        onClick={() => setPage((p: number) => Math.min(p + 1, totalPages))}
      >
        Next
      </button>
    </div>
  );
};
