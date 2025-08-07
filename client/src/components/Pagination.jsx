export const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center gap-2 mt-4 mb-4">
      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        disabled={currentPage === 1}
        onClick={() => handlePageChange("prev")}
      >
        Previous
      </button>
      <span className="px-3 py-1">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange("next")}
      >
        Next
      </button>
    </div>
  );
};
