const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');

const app = express();

app.use(cors());
app.use(express.json());

// Configure AWS SDK
AWS.config.update({ region: "us-west-2" });
const s3 = new AWS.S3();

const BUCKET_NAME = "scoop-data"; // Your S3 bucket name

// Utility function to fetch CSV from S3
const fetchCSVFromS3 = async (fileKey) => {
  const params = { Bucket: BUCKET_NAME, Key: fileKey };

  try {
    const data = await s3.getObject(params).promise();
    return data.Body.toString("utf-8");
  } catch (error) {
    console.error(`Error fetching ${fileKey} from S3:`, error);
    throw error;
  }
};

// Route to fetch all companies forecasts CSV
app.get("/api/all_companies_forecasts", async (req, res) => {
  try {
    const csvData = await fetchCSVFromS3("all_companies_forecasts.csv");
    res.header("Content-Type", "text/csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all_companies_forecasts.csv" });
  }
});

// Route to fetch companies metadata CSV
app.get("/api/companies_data_1", async (req, res) => {
  try {
    const csvData = await fetchCSVFromS3("companies_data_1.csv");
    res.header("Content-Type", "text/csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch companies_data_1.csv" });
  }
});

// Example route to confirm server is running
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Start the server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Increase timeout if needed (5 minutes)
server.setTimeout(300000);