require('dotenv').config();
const express = require('express');
const app = express();

const API_KEY = process.env.API_KEY || 'your-api-key';

function checkApiKey(req, res, next) {
  const apiKey = req.query.api_key || req.headers['x-api-key'];

  if (apiKey === API_KEY) {
    next();
  } else {
    res.status(403).send('Forbidden: Invalid API Key');
  }
}

app.use(checkApiKey);

app.get('/', (req, res) => {
  res.send('Hello, authenticated user with a valid API key!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
