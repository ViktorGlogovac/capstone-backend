const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
const app = express();

app.use(cors());
app.use(express.json());

// Test
// Configure AWS SDK
AWS.config.update({ region: 'us-west-2' });

const s3 = new AWS.S3();

// Route to fetch the entire CSV from S3
app.get('/api/all_companies_forecasts', (req, res) => {
  const params = {
    Bucket: 'scoop-data',
    Key: 'all_companies_forecasts.csv'
  };

  const s3Stream = s3.getObject(params).createReadStream();

  // Set the correct headers for CSV
  res.header('Content-Type', 'text/csv');

  // Pipe the S3 stream directly to the response
  s3Stream.pipe(res);

  // Error handling
  s3Stream.on('error', (err) => {
    console.error('Error streaming from S3:', err);
    res.status(500).json({ error: 'Failed to stream data from S3' });
  });
});

// Example route to confirm server is running
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start the server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Increase timeout if needed (5 minutes)
server.setTimeout(300000);
