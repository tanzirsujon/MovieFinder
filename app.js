const express = require('express')
const app = express()
const collection = require('./routes/collection');
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

app.use('/watchlist', collection);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})