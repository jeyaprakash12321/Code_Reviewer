export const Sidebar = ({
  data = [],
  selectedSeverities,
  selectedIssueTypes,
  onSeverityChange,
  onIssueTypeChange,
}) => {
  const issueTypes = Array.from(
    new Set(data.map((item) => item.issueType).filter(Boolean))
  ).sort();

  const severities = Array.from(
    new Set(
      data
        .map((item) => (item.severity ? item.severity.toLowerCase() : null))
        .filter(Boolean)
    )
  ).sort();

  return (
    <div className="min-w-[200px] p-4 bg-gray-50 rounded-lg mr-4">
      <div className="mb-6">
        <span className="font-bold block mb-3">Issue Types</span>
        {issueTypes.map((item) => (
          <div key={item} className="flex gap-2 m-2">
            <input
              type="checkbox"
              id={`type-${item}`}
              value={item}
              checked={selectedIssueTypes.includes(item)}
              onChange={(e) => onIssueTypeChange(item, e.target.checked)}
            />
            <label htmlFor={`type-${item}`}>{item}</label>
          </div>
        ))}
      </div>

      <div>
        <span className="font-bold block mb-3">Severity</span>
        {severities.map((item) => (
          <div key={item} className="flex gap-2 m-2">
            <input
              type="checkbox"
              id={`severity-${item}`}
              value={item}
              checked={selectedSeverities.includes(item)}
              onChange={(e) => onSeverityChange(item, e.target.checked)}
            />
            <label htmlFor={`severity-${item}`}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
