import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./CSS/CompanyDetails.css";

// Register required Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function CompanyDetails() {
  const { companyName } = useParams();
  const decodedCompanyName = decodeURIComponent(companyName);
  const location = useLocation();
  // If navigated from another page, company data might already be in location.state.
  const company = location.state?.company;

  const [selectedGraphType, setSelectedGraphType] = useState("YTD");
  const [companyData, setCompanyData] = useState(company);

  // On mount, if we don’t already have company data, fetch and parse CSV.
  useEffect(() => {
    if (!companyData) {
      fetch("http://localhost:3001/api/all_companies_forecasts")
        .then((response) => response.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const data = results.data;
              // Group rows by company_id
              const grouped = {};
              data.forEach((row) => {
                if (!row.company_id) return;
                if (!grouped[row.company_id]) {
                  grouped[row.company_id] = [];
                }
                grouped[row.company_id].push(row);
              });
              // Find the matching company by company_id (decodedCompanyName)
              const matchedCompany = Object.values(grouped).find(
                (rows) => rows[0]?.company_id === decodedCompanyName
              );

              if (matchedCompany) {
                setCompanyData({
                  name: decodedCompanyName,
                  // Use actual scoop_count if available (or null if predicted row)
                  scoopCounts: matchedCompany.map((row) =>
                    row.scoop_count !== "" ? parseFloat(row.scoop_count) : null
                  ),
                  // For predicted, if a value is provided then parse it; otherwise, null.
                  predictedCounts: matchedCompany.map((row) =>
                    row.predicted_scoop_count !== "" ? parseFloat(row.predicted_scoop_count) : null
                  ),
                  dates: matchedCompany.map((row) => row.date),
                });
              }
            },
          });
        })
        .catch((error) => console.error("Error fetching company data:", error));
    }
  }, [companyData, decodedCompanyName]);

  /**
   * filterData() returns arrays for actualCounts, predictedCounts, and labels (dates)
   * based on the selected graph type.
   *
   * Graph type options:
   * - "YTD": Last year’s actual data (from one year before the last actual date) plus any predicted dates.
   * - "Month": Last 3 weeks (21 days) of actual data plus the predicted week.
   * - "Max": All actual data plus the predicted week.
   *
   * We determine the "last actual date" as the latest date where a predicted value is not provided.
   */
  const filterData = (graphType) => {
    if (!companyData) {
      return { actualCounts: [], predictedCounts: [], filteredDates: [] };
    }

    // Convert date strings to Date objects.
    const dates = companyData.dates.map((d) => new Date(d));

    // Determine the last actual date (the most-recent row where predictedCounts is null).
    let lastActualDate = null;
    dates.forEach((d, i) => {
      if (companyData.predictedCounts[i] === null) {
        lastActualDate = d;
      }
    });
    if (!lastActualDate) {
      lastActualDate = dates[dates.length - 1];
    }

    // Determine the window start date based on the graph type.
    let windowStartDate;
    if (graphType === "YTD") {
      windowStartDate = new Date(lastActualDate);
      windowStartDate.setFullYear(windowStartDate.getFullYear() - 1);
    } else if (graphType === "Month") {
      windowStartDate = new Date(lastActualDate.getTime() - 21 * 24 * 60 * 60 * 1000);
    } else if (graphType === "Max") {
      windowStartDate = new Date(-8640000000000000); // effectively the earliest date possible
    } else {
      windowStartDate = new Date(-8640000000000000);
    }

    const filteredDates = [];
    const actualCounts = [];
    const predictedCounts = [];

    // Loop over every row in companyData.
    for (let i = 0; i < dates.length; i++) {
      const d = dates[i];
      if (d >= windowStartDate) {
        filteredDates.push(d.toISOString().split("T")[0]);
        if (d <= lastActualDate) {
          // This row is from actual data.
          actualCounts.push(companyData.scoopCounts[i]);
          predictedCounts.push(null);
        } else {
          // This row is predicted.
          actualCounts.push(null);
          predictedCounts.push(companyData.predictedCounts[i]);
        }
      }
    }

    return { actualCounts, predictedCounts, filteredDates };
  };

  // Get filtered data arrays.
  const { actualCounts, predictedCounts, filteredDates } = filterData(selectedGraphType);
  // Create a continuous (combined) data array:
  const combinedCounts = filteredDates.map((_, i) => {
    return actualCounts[i] !== null ? actualCounts[i] : predictedCounts[i];
  });
  // Determine the first index where predicted data begins.
  const firstPredictedIndex = filteredDates.findIndex((_, i) => actualCounts[i] === null);

  // Build the Chart.js data object using a single dataset.
  const chartData = {
    labels: filteredDates,
    datasets: [
      {
        label: "Scoop Count",
        data: combinedCounts,
        fill: false,
        borderColor: "blue",
        tension: 0.4,
        // Use segment options to style predicted portions as dashed.
        segment: {
          borderColor: (ctx) => {
            if (firstPredictedIndex !== -1 && ctx.p0DataIndex >= firstPredictedIndex) {
              return "red"; // Change color for predicted data
            }
            return "blue"; // Keep actual data in blue
          },
          borderDash: (ctx) => {
            if (firstPredictedIndex !== -1 && ctx.p0DataIndex >= firstPredictedIndex) {
              return [5, 5];
            }
            return [];
          },
        },
      },
    ],
  };

  return (
    <div className="company_content_area">
      <div className="page-title">{decodedCompanyName}</div>
      <div className="line"></div>

      <div className="all_graph_filter_container">
        <div className="graph_header">Prediction Graph</div>

        <div className="specifc_graph_filter_container">
          <div
            className={`graph_filter ${selectedGraphType === "YTD" ? "active_filter" : ""}`}
            onClick={() => setSelectedGraphType("YTD")}
          >
            <div className={selectedGraphType === "YTD" ? "filter_text_active" : "filter_text"}>YTD</div>
          </div>
          <div
            className={`graph_filter ${selectedGraphType === "Month" ? "active_filter" : ""}`}
            onClick={() => setSelectedGraphType("Month")}
          >
            <div className={selectedGraphType === "Month" ? "filter_text_active" : "filter_text"}>Month</div>
          </div>
          <div
            className={`graph_filter ${selectedGraphType === "Max" ? "active_filter" : ""}`}
            onClick={() => setSelectedGraphType("Max")}
          >
            <div className={selectedGraphType === "Max" ? "filter_text_active" : "filter_text"}>Max</div>
          </div>
        </div>

        <div className="graph_container">
          {companyData ? (
            <Line data={chartData} />
          ) : (
            <p>Loading data for {decodedCompanyName}...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDetails;
