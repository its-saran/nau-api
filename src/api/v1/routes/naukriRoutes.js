import express from "express";
import {scrapeNaukri} from "../controllers/naukri-single.js";

const router = express.Router();

router.get('/scrape', scrapeNaukri);

export default router;