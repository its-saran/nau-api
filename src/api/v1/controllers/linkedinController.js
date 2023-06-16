import { startLinkedin } from "../services/linkedinService.js";
import utils from '../utils/utils.js';

const scrapeLinkedin = async (req, res) => {
  try {
      const query = req.query;
      
      const keyword = query.keyword;
      const location = query.location;
      const maxJobs = query.maxjobs;
      const collectionName = 'rawJobs'

      const rawData = await startLinkedin({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})
      utils.saveJSON(rawData, 'linkedin-jobs.json');
      utils.saveFirestore(collectionName, rawData);
      res.send(rawData)
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeLinkedin };