import React from "react";
import { Link } from "react-router-dom";
import { FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";
import "./CSS/ProjectionsPage.css";

const StagnantCompanyBox = ({ company }) => (
  <Link to={`/projections/company/${encodeURIComponent(company.name)}`} className="company_link">
    <div className="company_box">
      <div className="company_header">{company.name}</div>
      <div className="status_box">
        <div className="scoop_status">Scoop Trend:</div>
        <div className="icon">
          <div className="dash_line"></div>
        </div>
      </div>
      <div className="status_box2">
        <div className="accuracy_status">Accuracy:</div>
        <div className="icon">
          <div className="accuracy_amount">{company.accuracy}%</div>
        </div>
      </div>
    </div>
  </Link>
);

const UpTrendCompanyBox = ({ company }) => (
  <Link to={`/projections/company/${encodeURIComponent(company.name)}`} className="company_link">
    <div className="company_box">
      <div className="company_header">{company.name}</div>
      <div className="status_box">
        <div className="scoop_status">Scoop Trend:</div>
        <div className="icon_up_arrow">
          <FaAngleDoubleUp className="up_arrow" />
        </div>
      </div>
      <div className="status_box2">
        <div className="accuracy_status">Accuracy:</div>
        <div className="icon">
          <div className="accuracy_amount">{company.accuracy}%</div>
        </div>
      </div>
    </div>
  </Link>
);

const DownTrendCompanyBox = ({ company }) => (
  <Link to={`/projections/company/${encodeURIComponent(company.name)}`} className="company_link">
    <div className="company_box">
      <div className="company_header">{company.name}</div>
      <div className="status_box">
        <div className="scoop_status">Scoop Trend:</div>
        <div className="icon_up_arrow">
          <FaAngleDoubleDown className="down_arrow" />
        </div>
      </div>
      <div className="status_box2">
        <div className="accuracy_status">Accuracy:</div>
        <div className="icon">
          <div className="accuracy_amount">{company.accuracy}%</div>
        </div>
      </div>
    </div>
  </Link>
);

export { StagnantCompanyBox, UpTrendCompanyBox, DownTrendCompanyBox };
