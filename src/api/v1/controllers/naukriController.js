import firestore from '../database/firestore-utils.js'
import { startNaukri } from "../services/naukriService.js";

const scrapeNaukri = async (req, res) => {
  try {
      const query = req.query;
      
      const keyword = query.keyword;
      const location = query.location;
      const maxJobs = query.maxjobs;

      const rawData = await startNaukri({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})
      const collectionName = 'rawJobs'
      firestore.addData(collectionName, rawData);
      res.send(rawData)
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeNaukri };
