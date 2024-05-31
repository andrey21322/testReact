const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

let data;

fs.readFile('data.json', 'utf8')
  .then((jsonData) => {
    data = JSON.parse(jsonData);
  })
  .catch((err) => {
    console.error('Error reading data file:', err);
    process.exit(1);
  });

app.post('/search', (req, res) => {
  const { email, number } = req.body;
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  setTimeout(() => {
    const result = data.filter(item => 
      item.email === email && (number ? item.number === number.replace(/-/g, '') : true)
    );
    res.json(result);
  }, 2000);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
