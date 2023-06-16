import express from 'express';
import bodyParser from 'body-parser';
import v1ScrapeRouter from './api/v1/routes/scrapeRoutes.js';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use('/api/v1/', v1ScrapeRouter);

app.listen(PORT, () => {
  console.log(`API is live on http://localhost:${PORT}`);
  console.log(`To scrape Naukri, go to http://localhost:${PORT}/api/v1/naukri`);
  console.log(`To scrape Linkedin, go to http://localhost:${PORT}/api/v1/linkedin`);
  console.log(`To scrape Indeed, go to http://localhost:${PORT}/api/v1/indeed`);
});

