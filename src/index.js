import express from 'express';
import bodyParser from 'body-parser';
import v1ScrapeRouter from './api/v1/routes/scrapeRoutes.js';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use('/api/v1/', v1ScrapeRouter);

app.listen(PORT, () => {
  console.log(`API is live on http://localhost:${PORT}`);

  console.log(`Try naukri scraper by going to http://localhost:${PORT}/api/v1/naukri?keyword=Data%20analyst&location=Bangalore`);
  console.log(`Try naukri scraper by going to http://localhost:${PORT}/api/v1/naukri?keyword=Data%20analyst&location=Bangalore&maxjobs=100`);
  console.log(`Try Linkedin scraper by going to http://localhost:${PORT}/api/v1/linkedin?keyword=Data%20analyst&location=Bangalore`);
  console.log(`Try Indeed scraper by going to http://localhost:${PORT}/api/v1/indeed?keyword=Data%20analyst&location=Bangalore`);
  console.log(`Try naukri scraper by going to http://localhost:${PORT}/api/v1/search?keyword=Data%20analyst&location=Bangalore`);

});

