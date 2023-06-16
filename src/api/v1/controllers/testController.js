import { startNaukri } from "../services/testService.js";

const scrapeNaukri = async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Transfer-Encoding', 'chunked');

    const sendData = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    let scrapedData = null;

    await startNaukri({ jobKeyword: 'developer', jobLocation: 'kochi', maxJobs: 100 }, (currentJobs, totalJobs, data) => {
      const progress = Math.round((currentJobs / totalJobs) * 100);
      sendData({ progress, data }); // Include the scraped data in the progress update
      scrapedData = data; // Update the scraped data for later use
    });

    sendData({ progress: 100, data: scrapedData }); // Send the final progress along with the scraped data
    res.end();
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

export { scrapeNaukri };
