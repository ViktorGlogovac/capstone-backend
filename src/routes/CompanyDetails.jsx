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
  // If we navigated here from another page, "company" might be in location.state.
  const company = location.state?.company;

  const [selectedGraphType, setSelectedGraphType] = useState("YTD");
  const [companyData, setCompanyData] = useState(company);

  // 1. On initial mount, if we have no company data (e.g. user refreshed the page),
  //    fetch all CSV data and parse it to find the matching company rows.
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

              // Group data by company_id
              const grouped = {};
              data.forEach((row) => {
                if (!row.company_id) return;
                if (!grouped[row.company_id]) {
                  grouped[row.company_id] = [];
                }
                grouped[row.company_id].push(row);
              });

              // Find the matching company by name
              const matchedCompany = Object.values(grouped).find(
                (rows) => rows[0]?.company_id === decodedCompanyName
              );

              if (matchedCompany) {
                setCompanyData({
                  name: decodedCompanyName,
                  scoopCounts: matchedCompany.map((row) => parseFloat(row.scoop_count) || 0),
                  predictedCounts: matchedCompany.map((row) => parseFloat(row.predicted_scoop_count) || 0),
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
   * This function filters out the last 28 days based on the
   * data's own *latest date*, then treats the final 4 entries
   * within that 28-day window as “predicted,” and the earlier
   * ones as “actual.”
   */
  const filterLastMonthData = () => {
    if (!companyData) {
      return { actualCounts: [], predictedCounts: [], filteredDates: [] };
    }

    // Convert each date-string to a Date object
    const dateObjects = companyData.dates.map((d) => new Date(d));

    // Find the LATEST date in the entire dataset
    const maxDateValue = Math.max(...dateObjects);
    const maxDate = new Date(maxDateValue);

    // Start date: 28 days before maxDate
    const startDate = new Date(maxDate.getTime() - 28 * 24 * 60 * 60 * 1000);

    // Collect rows that are between [startDate, maxDate]
    let filteredRows = [];
    companyData.dates.forEach((dateStr, i) => {
      const dateObj = new Date(dateStr);
      if (dateObj >= startDate && dateObj <= maxDate) {
        filteredRows.push({
          date: dateObj,
          actual: companyData.scoopCounts[i],
          predicted: companyData.predictedCounts[i],
        });
      }
    });

    // Sort those rows in ascending date order
    filteredRows.sort((a, b) => a.date - b.date);

    // Last 4 entries become predicted
    const totalCount = filteredRows.length;
    const predictedStartIndex = Math.max(0, totalCount - 4); // or change to -7 for 7 predicted days

    const filteredDates = [];
    const actualCounts = [];
    const predictedCounts = [];

    filteredRows.forEach((row, idx) => {
      // Format date as e.g. 2021-08-01
      const dateString = row.date.toISOString().split("T")[0];
      filteredDates.push(dateString);

      if (idx < predictedStartIndex) {
        // These are "actual"
        actualCounts.push(row.actual);
        predictedCounts.push(null);
      } else {
        // These last 4 are "predicted"
        actualCounts.push(null);
        predictedCounts.push(row.predicted);
      }
    });

    return { actualCounts, predictedCounts, filteredDates };
  };

  // Default data is from the entire dataset:
  let filteredDates = companyData?.dates || [];
  let actualCounts = companyData?.scoopCounts || [];
  let predictedCounts = [];

  // Decide how to slice the data based on selectedGraphType
  if (companyData) {
    if (selectedGraphType === "Month") {
      const { actualCounts: a, predictedCounts: p, filteredDates: d } = filterLastMonthData();
      actualCounts = a;
      predictedCounts = p;
      filteredDates = d;
    } else if (selectedGraphType === "YTD") {
      // You might apply a different filter: e.g. from Jan 1 of the current year
      // or from the first date of the dataset in the current year.
      // For simplicity, we’ll just leave the entire dataset for now.
    } else if (selectedGraphType === "Max") {
      // "Max" = entire dataset, so no filtering.
    }
  }

  // Build the Chart.js data object
  const chartData = {
    labels: filteredDates,
    datasets: [
      {
        label: "Actual Scoop Count",
        data: actualCounts,
        fill: false,
        borderColor: "blue",
        tension: 0.4,
      },
      {
        label: "Predicted Scoop Count",
        data: predictedCounts,
        fill: false,
        borderColor: "orange",
        borderDash: [5, 5],
        tension: 0.4,
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
            <div className="filter_text">YTD</div>
          </div>
          <div
            className={`graph_filter ${selectedGraphType === "Month" ? "active_filter" : ""}`}
            onClick={() => setSelectedGraphType("Month")}
          >
            <div className="filter_text">Month</div>
          </div>
          <div
            className={`graph_filter ${selectedGraphType === "Max" ? "active_filter" : ""}`}
            onClick={() => setSelectedGraphType("Max")}
          >
            <div className="filter_text">Max</div>
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
