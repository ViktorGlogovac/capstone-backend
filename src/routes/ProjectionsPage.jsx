import React from 'react';
import "./CSS/ProjectionsPage.css";
import { FaArrowAltCircleUp } from "react-icons/fa";

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
            <div className="icon">
              <div className="dash_line"></div>
            </div>
          </div>
          <div className="status_box">
            <div className="accuracy_status">Accuracy:</div>
            <div className="icon">
              <div className="accuracy_amount">85%</div>
            </div>
          </div>
        </div>
        <div className="company_box">
          <div className="company_header">Company Name</div>
          <div className="status_box">
            <div className="scoop_status">Scoop Trend:</div>
            <div className="icon_up_arrow">
              <FaArrowAltCircleUp className='up_arrow'/>
            </div>
          </div>
          <div className="status_box">
            <div className="accuracy_status">Accuracy:</div>
            <div className="icon">
              <div className="accuracy_amount">77%</div>
            </div>
          </div>
        </div>
        <div className="company_box">
          <div className="company_header">Company Name</div>
          <div className="status_box">
            <div className="scoop_status">Scoop Trend:</div>
            <div className="icon">
              <div className="dash_line"></div>
            </div>
          </div>
          <div className="status_box">
            <div className="accuracy_status">Accuracy:</div>
            <div className="icon">
              <div className="accuracy_amount">95%</div>
            </div>
          </div>
        </div>
        <div className="company_box"></div>
      </div>
    </div>
  );
}

export default ProjectionsPage;
