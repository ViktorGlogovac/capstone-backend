import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import dummyGraphData from "../Data/GraphData"; // Import graph data
import "./CSS/CompanyDetails.css";

// Register required Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function CompanyDetails() {
  const { companyName } = useParams(); // Get the company name from URL
  const decodedCompanyName = decodeURIComponent(companyName);
  
  // State to manage selected graph type (default is YTD)
  const [selectedGraphType, setSelectedGraphType] = useState("YTD");

  // Get the graph data for the current company, or default to empty values
  const graphData = dummyGraphData[decodedCompanyName]?.[selectedGraphType] || { labels: [], data: [] };

  // Prepare the chart data for react-chartjs-2
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
    <div className="all_company_container">
        <div className="company_content_area">
        <div className="page-title">{decodedCompanyName}</div>
        <div className="line"></div>

        <div className="all_graph_filter_container">
            <div className="graph_header">Prediction Graph</div>
            
            {/* Graph Filters */}
            <div className="specifc_graph_filter_container">
            <div 
                className={`graph_filter ${selectedGraphType === "YTD" ? "active_filter" : ""}`} 
                onClick={() => setSelectedGraphType("YTD")}
            >
                <div className="filter_text">YTD</div>
            </div>
            <div 
                className={`graph_filter ${selectedGraphType === "Weekly" ? "active_filter" : ""}`} 
                onClick={() => setSelectedGraphType("Weekly")}
            >
                <div className="filter_text">Weekly</div>
            </div>
            <div 
                className={`graph_filter ${selectedGraphType === "Max" ? "active_filter" : ""}`} 
                onClick={() => setSelectedGraphType("Max")}
            >
                <div className="filter_text">Max</div>
            </div>
            </div>

            {/* Graph Container */}
            <div className="graph_container">
            {graphData.labels.length > 0 ? (
                <Line data={chartData} />
            ) : (
                <p>No data available for {decodedCompanyName}</p>
            )}
            </div>
        </div>
        </div>
    </div>
  );
}

export default CompanyDetails;
