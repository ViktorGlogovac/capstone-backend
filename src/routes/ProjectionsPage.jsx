import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./CSS/ProjectionsPage.css";
import "./CSS/Filter.css";
import "../App.css";

// Import our “box” components
import {
  StagnantCompanyBox,
  UpTrendCompanyBox,
  DownTrendCompanyBox,
} from "./CompanyBoxes";

function ProjectionsPage() {
  // State for CSV-loaded companies data
  const [companies, setCompanies] = useState([]);

  // Filter states
  const [selectedTrend, setSelectedTrend] = useState("");   // Scoop Trend filter
  const [searchName, setSearchName] = useState("");         // Customer Name filter
  const [searchCountry, setSearchCountry] = useState("");   // Customer Country filter
  const [searchAccuracy, setSearchAccuracy] = useState(""); // Accuracy filter
  const [selectedSize, setSelectedSize] = useState("");     // Company Size filter

  useEffect(() => {
    // Fetch the CSV from your backend route
    fetch("http://localhost:3001/api/all_companies_forecasts")
      .then((response) => response.text())
      .then((csvText) => {
        // Parse CSV text into JSON using Papa Parse
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;

            console.log("Parsed CSV Data:", data); // Debugging parsed data

            // Group rows by company_id (since the CSV may have multiple rows per company)
            const grouped = {};
            data.forEach((row) => {
              if (!row.company_id) return; // guard if row is malformed
              if (!grouped[row.company_id]) {
                grouped[row.company_id] = [];
              }
              grouped[row.company_id].push(row);
            });

            console.log("Grouped Data by Company ID:", grouped); // Debug grouped data

            // For each company, pick the row with the most recent date to set up display
            const companiesData = Object.keys(grouped).map((companyId) => {
              const rows = grouped[companyId].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
              );
              const latestRow = rows[0];

              // Determine the trend based on the alert field
              let trend = "stagnant";
              if (
                latestRow.alert &&
                latestRow.alert.trim() !== "" &&
                latestRow.alert.toLowerCase() !== "no alert"
              ) {
                trend = latestRow.alert.toLowerCase(); // e.g. "up", "down"
              }

              return {
                id: companyId,
                name: companyId || "Unknown Company",
                trend: trend || "stagnant",
                country: latestRow.country || "Unknown",
                accuracy: latestRow.accuracy || "N/A",
                size: latestRow.size || "Unknown",
                description: latestRow.description || "No description available",

                // Add scoop and prediction data
                scoopCounts: rows.map(row => parseFloat(row.scoop_count) || 0),
                predictedCounts: rows.map(row => parseFloat(row.predicted_scoop_count) || 0),
                dates: rows.map(row => row.date || ""),
              };
            });

            setCompanies(companiesData);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error);
      });
  }, []);

  // Apply filters to the companies data
  const filteredCompanies = companies.filter((company) => {
    const trendMatches = selectedTrend
      ? company?.trend === selectedTrend
      : true;

    const nameMatches = searchName
      ? (company?.name?.toLowerCase() ?? "").includes(searchName.toLowerCase())
      : true;

    const countryMatches = searchCountry
      ? (company?.country?.toLowerCase() ?? "").includes(
          searchCountry.toLowerCase()
        )
      : true;

    const accuracyMatches = searchAccuracy
      ? (company?.accuracy?.toString() ?? "").includes(searchAccuracy)
      : true;

    const sizeMatches = selectedSize
      ? company?.size === selectedSize
      : true;

    return (
      trendMatches &&
      nameMatches &&
      countryMatches &&
      accuracyMatches &&
      sizeMatches
    );
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
        {filteredCompanies.map((company) => {
          if (company?.trend === "stagnant") {
            return <StagnantCompanyBox key={company.id} company={company} />;
          } else if (company?.trend === "up") {
            return <UpTrendCompanyBox key={company.id} company={company} />;
          } else if (company?.trend === "down") {
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
