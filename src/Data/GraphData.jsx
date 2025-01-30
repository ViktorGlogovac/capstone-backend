const dummyGraphData = {
    "Company A": {
      YTD: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [10, 30, 25, 60, 40, 80],
      },
      Weekly: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [15, 25, 20, 35],
      },
      Max: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data: [10, 30, 25, 60, 40, 80, 100, 120, 110, 130, 140, 150],
      },
      TableData: {
        weeks: ["Week -5", "Week -4", "Week -3", "Week -2", "Week -1", "Week 1 (Predicted)"],
        actual: [12, 18, 22, 30, 27, null], // Last week is predicted
        predicted: [11, 17, 21, 29, 28, 32], // Predicted values
      },
    },
    "Company B": {
      YTD: { labels: ["Jan", "Feb", "Mar"], data: [5, 20, 35] },
      Weekly: { labels: ["Week 1", "Week 2"], data: [12, 18] },
      Max: { labels: ["Jan", "Feb", "Mar", "Apr"], data: [5, 20, 35, 50] },
      TableData: {
        weeks: ["Week -5", "Week -4", "Week -3", "Week -2", "Week -1", "Week 1 (Predicted)"],
        actual: [14, 19, 23, 26, 30, null],
        predicted: [13, 18, 21, 25, 31, 35],
      },
    },
    "Company C": {
      YTD: { labels: ["Jan", "Feb", "Mar", "Apr"], data: [15, 25, 45, 55] },
      Weekly: { labels: ["Week 1", "Week 2"], data: [20, 30] },
      Max: { labels: ["Jan", "Feb", "Mar", "Apr", "May"], data: [15, 25, 45, 55, 70] },
      TableData: {
        weeks: ["Week -5", "Week -4", "Week -3", "Week -2", "Week -1", "Week 1 (Predicted)"],
        actual: [17, 22, 28, 32, 35, null],
        predicted: [16, 21, 27, 30, 36, 40],
      },
    },
    "Company D": {
      YTD: { labels: ["Jan", "Feb", "Mar", "Apr", "May"], data: [20, 35, 50, 70, 85] },
      Weekly: { labels: ["Week 1", "Week 2"], data: [25, 40] },
      Max: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], data: [20, 35, 50, 70, 85, 100] },
      TableData: {
        weeks: ["Week -5", "Week -4", "Week -3", "Week -2", "Week -1", "Week 1 (Predicted)"],
        actual: [22, 30, 40, 50, 60, null],
        predicted: [21, 29, 38, 48, 61, 70],
      },
    },
    "Company E": {
      YTD: { labels: ["Jan", "Feb", "Mar", "Apr", "May"], data: [12, 28, 42, 65, 78] },
      Weekly: { labels: ["Week 1", "Week 2"], data: [15, 22] },
      Max: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], data: [12, 28, 42, 65, 78, 95] },
      TableData: {
        weeks: ["Week -5", "Week -4", "Week -3", "Week -2", "Week -1", "Week 1 (Predicted)"],
        actual: [13, 20, 29, 40, 50, null],
        predicted: [12, 19, 27, 38, 51, 60],
      },
    },
  };
  
  export default dummyGraphData;
  