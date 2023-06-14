import express from "express";
import {scrapeNaukri} from "../controllers/naukri-single.js";
import {scrapeExample} from "../controllers/example.js";

const router = express.Router();

router.get('/scrape', scrapeNaukri);
router.get('/example', scrapeExample);

export default router;