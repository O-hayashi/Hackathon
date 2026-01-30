// Get params from URL
const urlParams = new URLSearchParams(window.location.search);
const riskScore = urlParams.get('score') || 0;
const trendString = urlParams.get('trend') || "0,0,0,0,0,0,0";
const trendData = trendString.split(',').map(Number);

// --- CHART 1: DOUGHNUT (Risk Level) ---
const ctx1 = document.getElementById('riskChart').getContext('2d');
let chartColor = '#22c55e'; // Green
if (riskScore > 40) chartColor = '#f59e0b'; // Orange
if (riskScore > 70) chartColor = '#dc2626'; // Red

new Chart(ctx1, {
  type: 'doughnut',
  data: {
    labels: ['Risk', 'Safe'],
    datasets: [{
      data: [riskScore, 100 - riskScore],
      backgroundColor: [chartColor, '#e5e7eb'],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // Important for resizing
    cutout: '75%',
    plugins: { legend: { display: false } }
  }
});

// --- CHART 2: LINE GRAPH (Trends) ---
const ctx2 = document.getElementById('trendChart').getContext('2d');

new Chart(ctx2, {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'New Cases',
      data: trendData,
      borderColor: '#3b82f6', // Blue Line
      backgroundColor: 'rgba(59, 130, 246, 0.1)', // Light Blue Fill
      fill: true,
      tension: 0.4 // Makes line curved
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // Important for resizing
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true }
    }
  }
});