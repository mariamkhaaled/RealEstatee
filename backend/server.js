const express = require('express');

const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

let properties = [];

app.get('/test', (req, res) => {
  res.send('API is working');
});

app.get('/properties', (req, res) => {
  res.json(properties);
});

app.post('/properties', (req, res) => {
  const newProperty = {
    id: Date.now(),
    ...req.body
  };

  properties.push(newProperty);

  res.status(201).json(newProperty);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});