import React from 'react';
import "./CSS/ProjectionsPage.css";
import { VscDash } from "react-icons/vsc";

function ProjectionsPage() {
  return (
    <div className="projections_content_area">
      <div className="projections-page-title">
        Projections
      </div>
      <div className="line"></div>
      <div className="filter_container">
          <div className="filter2">
            <div className="filter_header">Customer Name</div>
            <div className="search-bar-container">Search</div>
          </div>
          <div className="filter">
            <div className="filter_header">Scoop Trend</div>
            <div className="search-bar-container">Search</div>
          </div>
          <div className="filter">
            <div className="filter_header">Customer Country </div>
            <div className="search-bar-container">Search</div>
          </div>
          <div className="filter">
            <div className="filter_header">Company Name</div>
            <div className="search-bar-container">Search</div>
          </div>
        </div>

      <div className="company_area">
        <div className="company_box">
          <div className="company_header">Company Name</div>
          <div className="status_box">
            <div className="scoop_status">Scoop Trend:</div>
            <div className="dash">
              <VscDash className="icon" />
            </div>
          </div>
          <div className="status_box">
            <div className="accuracy_status">Accuracy:</div>
          </div>
        </div>
        <div className="company_box"></div>
        <div className="company_box"></div>
        <div className="company_box"></div>
      </div>
    </div>
  );
}

export default ProjectionsPage;
