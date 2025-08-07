import { useEffect, useState, useCallback } from "react";
import "../App.css";
import { Sidebar } from "../components/Sidebar";
import { IssuePage } from "./IssuePage";
import { Shimmer } from "../components/Shimmer";
import { Pagination } from "../components/Pagination";

export const HomePage = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const getReviewCode = async () => {
    try {
      setLoading(true);
      setSeverities([]);
      setIssueTypes([]);
      setCurrentPage(1);

      const response = await fetch(
        "http://127.0.0.1:8000/review-repo?repo_url=" +
          encodeURIComponent(repoUrl),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      const reviews = responseData?.reviews || [];

      const reviewsWithIds = reviews.map((review, index) => ({
        ...review,
        id: Date.now(),
      }));

      setData(reviewsWithIds);
      setFilteredData(reviewsWithIds);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = () => {
    if (repoUrl.trim()) {
      getReviewCode();
    }
  };

  const handleFilterSeverities = (value, checked) => {
    const normalizedValue = value.toLowerCase();
    setSeverities((prev) => {
      const newSeverities = checked
        ? [...prev, normalizedValue]
        : prev.filter((v) => v !== normalizedValue);
      return newSeverities;
    });
  };

  const handleFilterIssueTypes = (value, checked) => {
    setIssueTypes((prev) => {
      const newIssueTypes = checked
        ? [...prev, value]
        : prev.filter((v) => v !== value);
      return newIssueTypes;
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const filterData = useCallback(() => {
    let filtered = [...data];

    // Improved filtering logic
    if (severities.length > 0 || issueTypes.length > 0) {
      filtered = filtered.filter((issue) => {
        const severityMatch =
          severities.length === 0 ||
          (issue.severity && severities.includes(issue.severity.toLowerCase()));

        const issueTypeMatch =
          issueTypes.length === 0 ||
          (issue.issueType && issueTypes.includes(issue.issueType));

        return severityMatch && issueTypeMatch;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, severities, issueTypes]);

  useEffect(() => {
    filterData();
  }, [severities, issueTypes, data]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  return (
    <>
      <div className="m-auto text-center flex justify-center items-center gap-4 mt-5">
        <div>
          <input
            className="border-1 rounded-md w-[500px] h-10 border-l-5 border-green-700 focus-visible:border-b-2 px-3"
            type="text"
            placeholder="Enter Repo Url.."
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onPaste={(e) => setRepoUrl(e.target.value)}
          />
        </div>
        <div>
          <button
            className="bg-black text-white p-2 rounded cursor-pointer disabled:opacity-50"
            onClick={handleStartReview}
            disabled={!repoUrl.trim()}
          >
            Start <span className="text-[#ff8700]">Review</span>
          </button>
        </div>
      </div>

      <div className="mt-10 flex flex-row justify-between w-[75%] m-auto">
        {data?.length > 0 && (
          <Sidebar
            data={data}
            selectedSeverities={severities}
            selectedIssueTypes={issueTypes}
            onSeverityChange={handleFilterSeverities}
            onIssueTypeChange={handleFilterIssueTypes}
          />
        )}
        <div className="flex flex-col items-center">
          {loading ? (
            <Shimmer />
          ) : (
            <>
              {filteredData.length > 0 ? (
                <>
                  <div className="mb-4 w-full flex justify-between items-center px-4">
                    <div className="total-code-smells">
                      Total <span className="text-[#ff8700]">Code</span> Smells:{" "}
                      <span className="font-bold">{filteredData.length}</span>
                      {data.length !== filteredData.length && (
                        <span className="text-gray-500 text-sm ml-2">
                          (Filtered from {data.length})
                        </span>
                      )}
                    </div>
                  </div>
                  <IssuePage
                    issues={paginatedData}
                    key={`page-${currentPage}-${filteredData.length}`}
                  />
                  {filteredData.length > itemsPerPage && (
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={handlePageChange}
                      totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                    />
                  )}
                </>
              ) : data.length > 0 ? (
                <div className="text-gray-500">
                  No results match your filters
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
};
