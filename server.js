const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- ROUTES ---

// 1. Landing Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 2. Login Action (Redirects to Form)
app.post('/login', (req, res) => {
  console.log(`User Logged in: ${req.body.phone}`);
  res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// 3. Calculation Engine
app.post('/calculate-risk', (req, res) => {
  const data = req.body;
  let score = 0;

  // --- ALGORITHM START ---
  if (data.age_group === 'child') score += 15;

  if (data.fever === 'high') score += 30;
  else if (data.fever === 'moderate') score += 10;

  if (data.symptoms) {
    const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [data.symptoms];
    if (symptoms.includes('convulsions')) score += 40;
    if (symptoms.includes('confusion')) score += 20;
  }

  if (data.litchi_history === 'yes') score += 25;

  if (score > 100) score = 100;
  // --- ALGORITHM END ---

  // Mock Data: Active Cases in Ward
  const mockCases = Math.floor(Math.random() * 15) + 1;

  // Mock Data: 7-Day Trend (Generates random numbers for the line graph)
  let trendData = [];
  for (let i = 0; i < 7; i++) {
    trendData.push(Math.floor(Math.random() * 20));
  }
  const trendString = trendData.join(',');

  // Send data to Result Page via URL
  res.redirect(`/result.html?score=${score}&cases=${mockCases}&trend=${trendString}`);
});

// 4. Result Page Handler
app.get('/result.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'result.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});