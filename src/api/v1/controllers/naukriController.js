import { startNaukri } from "../services/naukriService.js";
import utils from '../utils/utils.js';


const scrapeNaukri = async (req, res) => {
  try {
      const query = req.query;
      
      const keyword = query.keyword;
      const location = query.location;
      const maxJobs = query.maxjobs;
      const collectionName = 'rawJobs'

      const rawData = await startNaukri({jobKeyword:keyword, jobLocation:location, maxJobs:maxJobs})
      // utils.saveJSON(rawData, 'naukri-jobs.json');
      // utils.saveFirestore(collectionName, rawData);
      res.send(rawData)
      utils.saveExcel(rawData, 'Naukri-jobs')
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeNaukri };
