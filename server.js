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

// Utility function to fetch CSV from S3, optionally with a specific VersionId
const fetchCSVFromS3 = async (fileKey, versionId = null) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
  };

  if (versionId) {
    params.VersionId = versionId;
  }

  try {
    const data = await s3.getObject(params).promise();
    return data.Body.toString("utf-8");
  } catch (error) {
    console.error(`Error fetching ${fileKey} from S3${versionId ? ` (version ${versionId})` : ""}:`, error);
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

// Get all versions of the forecasts file
app.get("/api/all_companies_forecasts/versions", async (req, res) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: "all_companies_forecasts.csv",
    };

    const result = await s3.listObjectVersions(params).promise();

    // Sort by LastModified descending
    const sortedVersions = (result.Versions || [])
      .filter(v => v.Key === "all_companies_forecasts.csv")
      .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));

    res.json(sortedVersions.slice(0, 10)); // Return top 10 most recent versions
  } catch (error) {
    console.error("Failed to list versions from S3:", error);
    res.status(500).json({ error: "Failed to fetch versions" });
  }
});

app.get("/api/all_companies_forecasts/version/:versionId", async (req, res) => {
  const versionId = req.params.versionId;

  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: "all_companies_forecasts.csv",
      VersionId: versionId,
    };

    const data = await s3.getObject(params).promise();
    res.header("Content-Type", "text/csv");
    res.send(data.Body.toString("utf-8"));
  } catch (error) {
    console.error("Failed to fetch CSV version:", error);
    res.status(500).json({ error: "Failed to fetch CSV version" });
  }
});

// Route to fetch companies metadata CSV
app.get("/api/companies_data", async (req, res) => {
  try {
    const csvData = await fetchCSVFromS3("companies_data.csv");
    res.header("Content-Type", "text/csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch companies_data.csv" });
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