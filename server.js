const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.post('/login', (req, res) => {
  // In a real app, we would save the phone/zip to a database here
  console.log(`User Logged in: ${req.body.phone} from Zip: ${req.body.zipcode}`);
  res.sendFile(path.join(__dirname, 'views', 'form.html'));
});


app.post('/calculate-risk', (req, res) => {
  const data = req.body;
  let score = 0;



  if (data.age_group === 'child') score += 15;


  if (data.fever === 'high') score += 25;       // >102°F
  else if (data.fever === 'moderate') score += 10; // 99-102°F


  if (data.symptoms) {

    const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [data.symptoms];

    if (symptoms.includes('convulsions')) score += 30; // Critical Sign
    if (symptoms.includes('unconscious')) score += 30; // Critical Sign
    if (symptoms.includes('stiff_neck')) score += 15;  // Meningitis Sign
    if (symptoms.includes('vomiting')) score += 10;    // General Sign
  }

  if (data.litchi_history === 'yes') score += 20; // Specific to AES (Chamki Bukhar)
  if (data.missed_meal === 'yes') score += 20;    // Hypoglycemia Trigger


  if (score > 100) score = 100;




  const mockCases = Math.floor(Math.random() * 15) + 1;

  let trendData = [];
  for (let i = 0; i < 7; i++) {
    trendData.push(Math.floor(Math.random() * 20));
  }
  const trendString = trendData.join(',');


  res.redirect(`/result.html?score=${score}&cases=${mockCases}&trend=${trendString}`);
});


app.get('/result.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'result.html'));
});


app.get('/precautions', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'precautions.html'));
});


app.get('/emergency', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'emergency.html'));
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


