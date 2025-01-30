import React from "react";
import { useParams } from "react-router-dom";
import "./CSS/CompanyDetails.css";

function CompanyDetails() {
  const { companyName } = useParams(); // Get the company name from URL

  return (
    <div className="company_content_area">
        <div className="page-title">{decodeURIComponent(companyName)}</div>
        <div className="line"></div>
        <div className="all_graph_filter_container">
            <div className="graph_header">Prediction Graph</div>
            <div className="specifc_graph_filter_container">
                <div className="graph_filter">
                    <div className="filter_text">YTD</div>
                </div>
                <div className="graph_filter">
                    <div className="filter_text">Weekly</div>
                </div>
                <div className="graph_filter">
                    <div className="filter_text">Max</div>
                </div>
            </div>
            <div className="graph_container"></div>
            
        </div>
    </div>
  );
}

export default CompanyDetails;
