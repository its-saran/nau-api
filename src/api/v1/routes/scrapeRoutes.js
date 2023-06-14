import express from "express";
import {scrapeNaukri} from "../controllers/naukri-single.js";
import {scrapeExample} from "../controllers/example.js";
import {scrapeIndeed} from "../controllers/indeed.js";

const router = express.Router();

router.get('/naukri', scrapeNaukri);
router.get('/example', scrapeExample);
router.get('/indeed', scrapeIndeed);

export default router;