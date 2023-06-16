import { startLinkedin } from "../services/linkedinService.js";

const scrapeLinkedin = async (req, res) => {
  try {
    const query = req.query;
    
    const keyword = query.keyword;
    const location = query.location;

    const rawData = await startLinkedin({jobKeyword:keyword, jobLocation:location})
    res.send(rawData)
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeLinkedin };