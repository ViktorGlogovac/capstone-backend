# Skywatch Backend Server

An Express.js API for retrieving and serving solar energy project forecasts from AWS S3.

## Prerequisites

- **Node.js** v16 or higher
- **npm** (comes with Node.js)
- **AWS credentials** (configured via AWS CLI or environment variables)

## Installation

1. Clone the repository and navigate into it:
   ```bash
   [https://github.com/ViktorGlogovac/capstone-backend.git]
   cd capstone-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Ensure your AWS credentials and region are set:

- **Via AWS CLI**:
  ```bash
  aws configure
  ```

- **Via environment variables**:
  ```bash
  export AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
  export AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
  export AWS_DEFAULT_REGION=us-west-2
  ```

In `server.js`, confirm or update the S3 bucket name and file keys if needed:

```js
const BUCKET_NAME = "scoop-data";
// CSV files in S3:
// - all_companies_forecasts.csv
// - companies_data.csv
```

## Usage

### Start the Server

- **Directly with Node.js**:
  ```bash
  node server.js
  ```

- **Using npm script** (if added to `package.json`):
  ```bash
  npm start
  ```

The server listens on port **3001** by default (configurable via `PORT` environment variable).

### Endpoints

| Method | Path                                         | Description                                              |
| ------ | -------------------------------------------- | -------------------------------------------------------- |
| GET    | `/api/hello`                                 | Health check; returns a JSON greeting message.           |
| GET    | `/api/all_companies_forecasts`               | Retrieves the latest `all_companies_forecasts.csv`.      |
| GET    | `/api/all_companies_forecasts/versions`      | Lists the 10 most recent versions of the forecasts CSV.  |
| GET    | `/api/all_companies_forecasts/version/:id`   | Fetches a specific version of the forecasts CSV.         |
| GET    | `/api/companies_data`                        | Retrieves the `companies_data.csv` metadata file.        |

- CSV endpoints return `Content-Type: text/csv`.
- Version listing returns JSON with S3 version metadata.

### Server Timeout

The HTTP request timeout is set to **5 minutes**:

```js
server.setTimeout(300000);
```

## License

This project is licensed under the [MIT License](LICENSE).

