export const IssueCard = ({
  id,
  filename,
  lineNo,
  issueName,
  severity,
  issueType,
  description,
  fix,
  isOpen,
  onToggleFix,
}) => {
  const severityColors = {
    critical: "#ff3366",
    high: "#ff9800",
    medium: "#ffc107",
    low: "#00bcd4",
    info: "#9c27b0",
  };

  const issueTypeColors = {
    Security: "#e53935",
    Performance: "#43a047",
    Bug: "#fb8c00",
    Style: "#1e88e5",
    "Best Practice": "#8e24aa",
  };

  return (
    <div className="w-[750px] shadow-2xl h-auto rounded-xl m-3 border-l-4">
      <div className="flex flex-col items-center justify-center p-5">
        <span className="font-bold underline">{issueName}</span>
        <span>{description}</span>
      </div>

      <div className="flex justify-between p-3">
        <div className="flex gap-10">
          <div className="">
            <div className="font-bold">File</div>
            <div>{filename}</div>
          </div>
          <div className="">
            <div className="font-bold">Line No</div>
            <div>{lineNo}</div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <span
            className="px-2 rounded-2xl"
            style={{
              backgroundColor: issueTypeColors[issueType] || "#e0e0e0",
              color: "#fff",
            }}
          >
            {issueType}
          </span>
          <span
            className="px-2 rounded-2xl"
            style={{
              backgroundColor:
                severityColors[severity?.toLowerCase()] || "#ffc107",
              color: "#fff",
            }}
          >
            {severity}
          </span>
        </div>
        <div className="flex items-center">
          <button className="text-sm" onClick={() => onToggleFix(id)}>
            {isOpen ? "Hide" : "Show"} <span className="font-bold">Fix</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <hr className="w-[90%] m-auto mt-2" />
          <div className="flex justify-center p-2 pb-4 rounded-b-xl">
            <div className="font-bold">Fix: </div>
            <br />
            {` ${fix}`}
          </div>
        </>
      )}
    </div>
  );
};
