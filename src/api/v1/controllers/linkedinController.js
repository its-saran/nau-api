import firestore from '../database/firestore-utils.js'
import { startLinkedin } from "../services/linkedinService.js";

const scrapeLinkedin = async (req, res) => {
  try {
      const query = req.query;
      
      const keyword = query.keyword;
      const location = query.location;
      const maxJobs = query.maxjobs;

      const rawData = await startLinkedin({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})
      const collectionName = 'rawJobs'
      firestore.addData(collectionName, rawData);
      res.send(rawData)
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeLinkedin };