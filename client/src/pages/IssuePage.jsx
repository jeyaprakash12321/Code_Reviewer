import { useState } from "react";
import { IssueCard } from "../components/IssueCard";

export const IssuePage = ({ issues = [] }) => {
  const [openIssueId, setOpenIssueId] = useState(null);
  console.log("issues ", issues);

  const handleToggleFix = (id) => {
    setOpenIssueId(openIssueId === id ? null : id);
  };

  console.log("issues ", issues);

  return (
    <div>
      {issues?.map((item) => (
        <IssueCard
          key={item.id || item.filename}
          {...item}
          isOpen={openIssueId === item.id}
          onToggleFix={handleToggleFix}
        />
      ))}
    </div>
  );
};
