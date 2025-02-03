import React from "react";
import { Link } from "react-router-dom";
import { FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";
import "./CSS/ProjectionsPage.css";

// Stagnant
const StagnantCompanyBox = ({ company }) => {
  if (!company) {
    // If "company" is missing or null, render a fallback.
    return <div className="company_box">No company data.</div>;
  }

  // Provide default values if fields are missing
  const displayName = company.name || "Unknown Company";
  const displayAccuracy =
    company.accuracy !== undefined ? `${company.accuracy}%` : "N/A";

  return (
  <Link
    to={{
      pathname: `/projections/company/${encodeURIComponent(displayName)}`,
      state: { company }
    }}
    className="company_link"
  >
      <div className="company_box">
        <div className="company_header">{displayName}</div>
        <div className="status_box">
          <div className="scoop_status">Scoop Trend:</div>
          <div className="icon">
            <div className="dash_line"></div>
          </div>
        </div>
        <div className="status_box2">
          <div className="accuracy_status">Accuracy:</div>
          <div className="icon">
            <div className="accuracy_amount">{displayAccuracy}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// UpTrend
const UpTrendCompanyBox = ({ company }) => {
  if (!company) {
    return <div className="company_box">No company data.</div>;
  }

  const displayName = company.name || "Unknown Company";
  const displayAccuracy =
    company.accuracy !== undefined ? `${company.accuracy}%` : "N/A";

  return (
    <Link
      to={`/projections/company/${encodeURIComponent(displayName)}`}
      className="company_link"
    >
      <div className="company_box">
        <div className="company_header">{displayName}</div>
        <div className="status_box">
          <div className="scoop_status">Scoop Trend:</div>
          <div className="icon_up_arrow">
            <FaAngleDoubleUp className="up_arrow" />
          </div>
        </div>
        <div className="status_box2">
          <div className="accuracy_status">Accuracy:</div>
          <div className="icon">
            <div className="accuracy_amount">{displayAccuracy}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// DownTrend
const DownTrendCompanyBox = ({ company }) => {
  if (!company) {
    return <div className="company_box">No company data.</div>;
  }

  const displayName = company.name || "Unknown Company";
  const displayAccuracy =
    company.accuracy !== undefined ? `${company.accuracy}%` : "N/A";

  return (
    <Link
      to={`/projections/company/${encodeURIComponent(displayName)}`}
      className="company_link"
    >
      <div className="company_box">
        <div className="company_header">{displayName}</div>
        <div className="status_box">
          <div className="scoop_status">Scoop Trend:</div>
          <div className="icon_up_arrow">
            <FaAngleDoubleDown className="down_arrow" />
          </div>
        </div>
        <div className="status_box2">
          <div className="accuracy_status">Accuracy:</div>
          <div className="icon">
            <div className="accuracy_amount">{displayAccuracy}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export { StagnantCompanyBox, UpTrendCompanyBox, DownTrendCompanyBox };
