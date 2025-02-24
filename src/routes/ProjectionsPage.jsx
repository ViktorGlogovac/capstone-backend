import React, { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import "./CSS/ProjectionsPage.css";
import "./CSS/Filter.css";
import "../App.css";

import {
  StagnantCompanyBox,
  UpTrendCompanyBox,
  DownTrendCompanyBox,
} from "./CompanyBoxes";

function ProjectionsPage() {
  // State for final “companies” array
  const [companies, setCompanies] = useState([]);

  // Filter states
  const [selectedTrend, setSelectedTrend] = useState("");   // Scoop Trend filter
  const [searchName, setSearchName] = useState("");         // Customer Name filter
  const [searchCountry, setSearchCountry] = useState("");   // Customer Country filter
  const [searchAccuracy, setSearchAccuracy] = useState(""); // Accuracy filter
  const [selectedSize, setSelectedSize] = useState("");     // Company Size filter

  useEffect(() => {
    fetch("http://localhost:3001/api/all_companies_forecasts")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data;
            console.log("Parsed CSV Data:", data);

            /**
             * Single-pass grouping:
             * We store each company's rows in a Map keyed by `company_id`.
             * Then we'll do one sort per company (for date order) just once.
             */
            const groupedMap = new Map();
            data.forEach((row) => {
              if (!row.company_id) return; // skip malformed rows

              const companyId = row.company_id;
              if (!groupedMap.has(companyId)) {
                groupedMap.set(companyId, []);
              }

              groupedMap.get(companyId).push(row);
            });

            /**
             * Now transform that grouped data into your final "companies" array.
             * We'll sort each company's rows by date once, so the chart data is in date order.
             * The "latest row" is simply the last item in sorted order.
             */
            const companiesData = [];
            for (const [companyId, rows] of groupedMap.entries()) {
              // Sort rows by date ascending
              rows.sort((a, b) => new Date(a.date) - new Date(b.date));
              const latestRow = rows[rows.length - 1] || {};

              // Decide the trend from latestRow.alert
              let trend = "stagnant";
              if (
                latestRow.alert &&
                latestRow.alert.toLowerCase() !== "no alert"
              ) {
                trend = latestRow.alert.toLowerCase(); // e.g. "up", "down"
              }

              // Build the final object
              companiesData.push({
                id: companyId,
                name: companyId || "Unknown Company",
                trend: trend || "stagnant",
                country: latestRow.country || "Unknown",
                accuracy: latestRow.accuracy || "N/A",
                size: latestRow.size || "Unknown",
                description: latestRow.description || "No description available",
                // Chart data
                scoopCounts: rows.map((r) => parseFloat(r.scoop_count) || 0),
                predictedCounts: rows.map(
                  (r) => parseFloat(r.predicted_scoop_count) || 0
                ),
                dates: rows.map((r) => r.date || ""),
              });
            }

            console.log("Final Companies Array:", companiesData);
            setCompanies(companiesData);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error);
      });
  }, []);

  /**
   * useMemo for filtering:
   * The filtering logic only re-runs if one of these dependencies changes:
   * companies, selectedTrend, searchName, searchCountry, searchAccuracy, selectedSize.
   */
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const trendMatches = selectedTrend
        ? company.trend === selectedTrend
        : true;

      const nameMatches = searchName
        ? (company.name || "").toLowerCase().includes(searchName.toLowerCase())
        : true;

      const countryMatches = searchCountry
        ? (company.country || "").toLowerCase().includes(
            searchCountry.toLowerCase()
          )
        : true;

      const accuracyMatches = searchAccuracy
        ? (company.accuracy || "").toString().includes(searchAccuracy)
        : true;

      const sizeMatches = selectedSize
        ? (company.size || "").toLowerCase() === selectedSize.toLowerCase()
        : true;

      return (
        trendMatches &&
        nameMatches &&
        countryMatches &&
        accuracyMatches &&
        sizeMatches
      );
    });
  }, [
    companies,
    selectedTrend,
    searchName,
    searchCountry,
    searchAccuracy,
    selectedSize,
  ]);

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
              <option value="increasing alert">Increasing</option>
              <option value="decreasing alert">Decreasing</option>
              <option value="stable">Stagnant</option>
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
          if (company.trend === "stable") {
            return <StagnantCompanyBox key={company.id} company={company} />;
          } else if (company.trend === "increasing alert") {
            return <UpTrendCompanyBox key={company.id} company={company} />;
          } else if (company.trend === "decreasing alert") {
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
