import React from "react";
import { useParams } from "react-router-dom";
import "./CSS/CompanyDetails.css";

function CompanyDetails() {
  const { companyName } = useParams(); // Get the company name from URL

  return (
    <div className="company_content_area">
      <div className="page-title">{decodeURIComponent(companyName)}</div>
      <div className="line"></div>




    </div>
  );
}

export default CompanyDetails;
