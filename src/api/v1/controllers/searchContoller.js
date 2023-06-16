import { startSearch } from "../services/searchService.js";

const totalSearch = async (req, res) => {
  try {
    const query = req.query;
    
    const keyword = query.keyword;
    const location = query.location;

    const naukriData = await startSearch.naukri({jobKeyword:keyword, jobLocation:location})
    const linkedinData = await startSearch.linkedin({jobKeyword:keyword, jobLocation:location})
    const indeedData = await startSearch.indeed({jobKeyword:keyword, jobLocation:location})

    const totalJobs = {
      'Naukri': naukriData,
      'Linkedin': linkedinData,
      'Indeed': indeedData,
    }

    res.send(totalJobs)
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { totalSearch };