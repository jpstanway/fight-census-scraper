require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';

const app = express();
const db = process.env.DB_URI || '';
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(db, { useNewUrlParser: true }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Database connected!');
    }
  })

app.get('/', (req, res) => {
  res.send('Fight Census Data Scraper');
});

app.listen(port, () => {
  console.log(`Scraper server listening at ${port}`);
});