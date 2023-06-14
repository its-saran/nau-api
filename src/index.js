import express from "express";
import bodyParser from "body-parser";
import v1ScrapeRouter from "./api/v1/routes/scrapeRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use("/api/v1/", v1ScrapeRouter);

app.listen(PORT, () => {
    console.log(`API is live on  http://localhost:${PORT}/api/v1/naukri`);
    console.log(`API is live on  http://localhost:${PORT}/api/v1/example`);
    console.log(`API is live on  http://localhost:${PORT}/api/v1/indeed`);

    console.log(`API is live on  https://nau-api.onrender.com/api/v1/naukri`);
    console.log(`API is live on  https://nau-api.onrender.com/api/v1/example`);
    console.log(`API is live on  https://nau-api.onrender.com/api/v1/indeed`);
});
