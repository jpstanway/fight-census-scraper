import express from 'express';

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Fight Census Data Scraper');
});

app.listen(port, () => {
  console.log(`Scraper server listening at ${port}`);
});