const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
const app = express();

app.use(cors());
app.use(express.json());

// Configure AWS SDK
AWS.config.update({ region: 'us-west-2' }); // Replace with your region if different

const s3 = new AWS.S3();

// Route to fetch CSV from S3
app.get('/api/scoops-data', (req, res) => {
  const params = {
    Bucket: 'scoop-data',
    Key: 'scoops_data.csv'
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.error('Error fetching from S3:', err);
      return res.status(500).json({ error: 'Failed to fetch data from S3' });
    }

    const csvContent = data.Body.toString('utf-8');
    res.header('Content-Type', 'text/csv');
    res.send(csvContent);
  });
});

// Example route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
