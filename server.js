const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

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
  // In a real app, we would save the phone/zip to a database here
  console.log(`User Logged in: ${req.body.phone} from Zip: ${req.body.zipcode}`);
  res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// 3. Calculation Engine (The Brain)
app.post('/calculate-risk', (req, res) => {
  const data = req.body;
  let score = 0;

  // --- ALGORITHM START ---

  // 1. Age Factor (Children are higher risk)
  if (data.age_group === 'child') score += 15;

  // 2. Fever Factor
  if (data.fever === 'high') score += 25;       // >102°F
  else if (data.fever === 'moderate') score += 10; // 99-102°F

  // 3. Symptoms (Handles single or multiple checkboxes)
  if (data.symptoms) {
    // Ensure 'symptoms' is always an array, even if only one box is checked
    const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [data.symptoms];

    if (symptoms.includes('convulsions')) score += 30; // Critical Sign
    if (symptoms.includes('unconscious')) score += 30; // Critical Sign
    if (symptoms.includes('stiff_neck')) score += 15;  // Meningitis Sign
    if (symptoms.includes('vomiting')) score += 10;    // General Sign
  }

  // 4. History Factors
  if (data.litchi_history === 'yes') score += 20; // Specific to AES (Chamki Bukhar)
  if (data.missed_meal === 'yes') score += 20;    // Hypoglycemia Trigger

  // Cap the score at 100%
  if (score > 100) score = 100;

  // --- ALGORITHM END ---

  // Mock Data: Active Cases in Ward (Random number 1-15)
  const mockCases = Math.floor(Math.random() * 15) + 1;

  // Mock Data: 7-Day Trend (Generates 7 random numbers for the line graph)
  let trendData = [];
  for (let i = 0; i < 7; i++) {
    trendData.push(Math.floor(Math.random() * 20));
  }
  const trendString = trendData.join(',');

  // Send data to Result Page via URL parameters
  res.redirect(`/result.html?score=${score}&cases=${mockCases}&trend=${trendString}`);
});

// 4. Result Page Handler
app.get('/result.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'result.html'));
});

// Route for Precautions Page
app.get('/precautions', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'precautions.html'));
});

// Route for Emergency Dashboard
app.get('/emergency', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'emergency.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


