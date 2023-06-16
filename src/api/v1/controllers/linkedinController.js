import { startLinkedin } from "../services/linkedinService.js";

const scrapeLinkedin = async (req, res) => {
  try {
      const rawData = await startLinkedin({jobKeyword:'developer', jobLocation:'kochi'})
      res.send(rawData)
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeLinkedin };