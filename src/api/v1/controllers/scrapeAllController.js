import utils from '../utils/utils.js';
import { startNaukri } from "../services/naukriService.js";
import { startIndeed } from "../services/indeedService.js";
import { startLinkedin } from "../services/linkedinService.js";

const scrapeAll = async (req, res) => {
  try {
    const query = req.query;
    
    const keyword = query.keyword;
    const location = query.location;
    const maxJobs = query.maxjobs;
    const collectionName = 'rawJobs'

    const rawNaukri = await startNaukri({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})
    const rawIndeed = await startIndeed({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})
    const rawLinkedin = await startLinkedin({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})

    const rawData = [...rawNaukri, ...rawIndeed, ...rawLinkedin];
    // utils.saveJSON(rawData, 'scraped-jobs.json');
    // utils.saveFirestore(collectionName, rawData);
    res.send(rawData)
    utils.saveExcel(rawData, 'Scraped-jobs')
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeAll };