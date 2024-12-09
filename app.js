const express = require('express')
const app = express()
const collection = require('./routes/collection');
const port = 3000

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

app.use('/watchlist', collection);

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})