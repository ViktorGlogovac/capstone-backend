import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import dummyGraphData from "../Data/GraphData";
import "./CSS/CompanyDetails.css";

// Register required Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function CompanyDetails() {
  const { companyName } = useParams();
  const decodedCompanyName = decodeURIComponent(companyName);
  
  const [selectedGraphType, setSelectedGraphType] = useState("YTD");

  // Get the graph and table data for the current company
  const companyData = dummyGraphData[decodedCompanyName] || { YTD: {}, Weekly: {}, Max: {}, TableData: {} };
  const graphData = companyData[selectedGraphType] || { labels: [], data: [] };
  const tableData = companyData.TableData || { weeks: [], actual: [], predicted: [] };

  // Prepare chart data
  const chartData = {
    labels: graphData.labels,
    datasets: [
      {
        label: `${decodedCompanyName} - ${selectedGraphType} Predictions`,
        data: graphData.data,
        fill: false,
        borderColor: "blue",
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
          <div className={`graph_filter ${selectedGraphType === "YTD" ? "active_filter" : ""}`} onClick={() => setSelectedGraphType("YTD")}>
            <div className="filter_text">YTD</div>
          </div>
          <div className={`graph_filter ${selectedGraphType === "Weekly" ? "active_filter" : ""}`} onClick={() => setSelectedGraphType("Weekly")}>
            <div className="filter_text">Weekly</div>
          </div>
          <div className={`graph_filter ${selectedGraphType === "Max" ? "active_filter" : ""}`} onClick={() => setSelectedGraphType("Max")}>
            <div className="filter_text">Max</div>
          </div>
        </div>

        {/* Graph Container */}
        <div className="graph_container">
          {graphData.labels.length > 0 ? <Line data={chartData} /> : <p>No data available for {decodedCompanyName}</p>}
        </div>
      </div>

      {/* SCOOP Data Table */}
      <div className="scoop_table_container">
        <div className="table_header">Scoop Data Trend </div>
        <table className="scoop_table">
          <thead>
            <tr>
              <th></th> {/* Empty cell for row headers */}
              {tableData.weeks.map((week, index) => (
                <th key={index}>{week}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Predicted</td>
              {tableData.predicted.map((value, index) => (
                <td key={index}>{value !== null ? value : "-"}</td>
              ))}
            </tr>
            <tr>
              <td>Actual</td>
              {tableData.actual.map((value, index) => (
                <td key={index}>{value !== null ? value : "-"}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompanyDetails;
