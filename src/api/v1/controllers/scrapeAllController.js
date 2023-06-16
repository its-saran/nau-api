import firestore from '../database/firestore-utils.js'
import { startNaukri } from "../services/naukriService.js";
import { startIndeed } from "../services/indeedService.js";
import { startLinkedin } from "../services/linkedinService.js";

const scrapeAll = async (req, res) => {
  try {
    const query = req.query;
    
    const keyword = query.keyword;
    const location = query.location;
    const maxJobs = query.maxjobs;

    const rawNaukri = await startNaukri({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})
    const rawIndeed = await startIndeed({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})
    const rawLinkedin = await startLinkedin({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})

    const rawData = [...rawNaukri, ...rawIndeed, ...rawLinkedin];
    const collectionName = 'rawJobs'
    firestore.addData(collectionName, rawData);

    res.send(rawData)
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeAll };