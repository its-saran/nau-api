import { startIndeed } from "../services/indeedService.js";

const scrapeIndeed = async (req, res) => {
  try {
      const rawData = await startIndeed({jobKeyword:'Data Analytics', jobLocation:'kochi'})
      res.send(rawData)
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeIndeed };