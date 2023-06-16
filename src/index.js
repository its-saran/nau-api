import express from 'express';
import bodyParser from 'body-parser';
import v1ScrapeRouter from './api/v1/routes/scrapeRoutes.js';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use('/api/v1/', v1ScrapeRouter);

app.listen(PORT, () => {
  console.log(`\nAPI is live on http://localhost:${PORT}`);
  console.log(`To get total jobs, go to http://localhost:${PORT}/api/v1/search?keyword=data%20analyst&location=kochi`);
  console.log(`To scrape Naukri, Indeed and Linkedin, go to http://localhost:${PORT}/api/v1/scrape?keyword=data%20analyst&location=kochi`);
  console.log(`\nTo scrape Naukri, go to http://localhost:${PORT}/api/v1/naukri?keyword=data%20analyst&location=kochi`);
  console.log(`To scrape Linkedin, go to http://localhost:${PORT}/api/v1/linkedin?keyword=data%20analyst&location=kochi`);
  console.log(`To scrape Indeed, go to http://localhost:${PORT}/api/v1/indeed?keyword=data%20analyst&location=kochi`);
  console.log(`\nLimites Naukri, Indeed and Linkedin scraper: http://localhost:${PORT}/api/v1/scrape?keyword=data%20analyst&location=kochi&maxjobs=10`);
  console.log(`Limited Naukri scraper: http://localhost:${PORT}/api/v1/naukri?keyword=data%20analyst&location=kochi&maxjobs=100`);
  console.log(`Limited Indeed scraper: http://localhost:${PORT}/api/v1/indeed?keyword=data%20analyst&location=kochi&maxjobs=10`);
  console.log(`Limited Linkedin scraper: http://localhost:${PORT}/api/v1/linkedin?keyword=data%20analyst&location=kochi&maxjobs=10`);
});

