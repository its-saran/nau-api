import express from "express";
import bodyParser from "body-parser";
import v1NaukriRouter from "./api/v1/routes/naukriRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use("/api/v1/", v1NaukriRouter);

app.listen(PORT, () => {
    console.log(`API is listening on port http://localhost:${PORT}/api/v1/scrape`);
});
