import { startNaukri } from "../services/naukriService.js";

const scrapeNaukri = async (req, res) => {
  try {
      const rawData = await startNaukri({jobKeyword:'developer', jobLocation:'kochi'})
      res.send(rawData)
      console.log(rawData)
  } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeNaukri };
