import { startIndeed } from "../services/indeedService.js";
import utils from '../utils/utils.js';

const scrapeIndeed = async (req, res) => {
  try {
      const query = req.query;

      const keyword = query.keyword;
      const location = query.location;
      const maxJobs = query.maxjobs;
      const collectionName = 'rawJobs'

      const rawData = await startIndeed({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})
      // utils.saveJSON(rawData, 'indeed-jobs.json');
      // utils.saveFirestore(collectionName, rawData);
      res.send(rawData)
      utils.saveExcel(rawData, 'Indeed-jobs')
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeIndeed };