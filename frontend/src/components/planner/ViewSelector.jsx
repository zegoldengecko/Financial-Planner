import React from "react";

// ---------------------- BUTTONS FOR VIEW SELECTION ----------------------
const ViewSelector = ({ currentView, handleViewChange }) => {
  const views = ["General", "Income", "Expense", "Trends"];

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "12px", marginTop: "50px", marginBottom: "20px" }}>
      {views.map(view => (
        <button
          key={view}
          onClick={() => handleViewChange(view)}
          style={{
            padding: "12px 24px",
            backgroundColor: currentView === view ? "#5a8fcf" : "#dbeeff",
            color: "black",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {view}
        </button>
      ))}
    </div>
  );
};

export default ViewSelector;
