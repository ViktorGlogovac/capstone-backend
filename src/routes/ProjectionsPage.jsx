import React, { useState } from "react";
import "./CSS/ProjectionsPage.css";
import "./CSS/Filter.css";
import "../App.css"
import { StagnantCompanyBox, UpTrendCompanyBox, DownTrendCompanyBox } from "./CompanyBoxes";

const dummyData = [
  { id: 1, name: "Company A", trend: "stagnant", country: "USA", accuracy: 85, size: "small" },
  { id: 2, name: "Company B", trend: "up", country: "Canada", accuracy: 77, size: "medium" },
  { id: 3, name: "Company C", trend: "down", country: "USA", accuracy: 95, size: "large" },
  { id: 4, name: "Company D", trend: "up", country: "Germany", accuracy: 82, size: "medium" },
  { id: 5, name: "Company E", trend: "stagnant", country: "France", accuracy: 91, size: "small" },
];

function ProjectionsPage() {
  const [selectedTrend, setSelectedTrend] = useState(""); // Trend filter
  const [searchName, setSearchName] = useState(""); // Customer Name filter
  const [searchCountry, setSearchCountry] = useState(""); // Customer Country filter
  const [searchAccuracy, setSearchAccuracy] = useState(""); // Accuracy filter
  const [selectedSize, setSelectedSize] = useState(""); // Company Size filter

  const filteredData = dummyData.filter((company) => {
    const matchesTrend = selectedTrend ? company.trend === selectedTrend : true;
    const matchesName = searchName ? company.name.toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchesCountry = searchCountry ? company.country.toLowerCase().includes(searchCountry.toLowerCase()) : true;
    const matchesAccuracy = searchAccuracy ? company.accuracy.toString().includes(searchAccuracy) : true;
    const matchesSize = selectedSize ? company.size === selectedSize : true;

    return matchesTrend && matchesName && matchesCountry && matchesAccuracy && matchesSize;
  });

  return (
    <div className="projections_content_area">
      <div className="page-title">Projections</div>
      <div className="line"></div>

      {/* Filter Container */}
      <div className="filter_container">
        {/* Customer Name Filter */}
        <div className="filter">
          <div className="filter_header">Customer Name</div>
          <div className="dropdown-container">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="dropdown_search_input"
              placeholder="Search by name..."
            />
          </div>
        </div>

        {/* Scoop Trend Filter */}
        <div className="filter">
          <div className="filter_header">Scoop Trend</div>
          <div className="dropdown-container">
            <select
              value={selectedTrend}
              onChange={(e) => setSelectedTrend(e.target.value)}
              className="dropdown"
            >
              <option value="">All Trends</option>
              <option value="up">Increasing</option>
              <option value="down">Decreasing</option>
              <option value="stagnant">Stagnant</option>
            </select>
          </div>
        </div>

        {/* Customer Country Filter */}
        <div className="filter">
          <div className="filter_header">Customer Country</div>
          <div className="dropdown-container">
            <input
              type="text"
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
              className="dropdown_search_input"
              placeholder="Search by country..."
            />
          </div>
        </div>

        {/* Accuracy Filter */}
        <div className="filter">
          <div className="filter_header">Accuracy</div>
          <div className="dropdown-container">
            <input
              type="text"
              value={searchAccuracy}
              onChange={(e) => setSearchAccuracy(e.target.value)}
              className="dropdown_search_input"
              placeholder="Enter accuracy..."
            />
          </div>
        </div>

        {/* Company Size Filter */}
        <div className="filter">
          <div className="filter_header">Company Size</div>
          <div className="dropdown-container">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="dropdown"
            >
              <option value="">All Sizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Company Area */}
      <div className="company_area">
        {filteredData.map((company) => {
          if (company.trend === "stagnant") {
            return <StagnantCompanyBox key={company.id} company={company} />;
          } else if (company.trend === "up") {
            return <UpTrendCompanyBox key={company.id} company={company} />;
          } else if (company.trend === "down") {
            return <DownTrendCompanyBox key={company.id} company={company} />;
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}

export default ProjectionsPage;
