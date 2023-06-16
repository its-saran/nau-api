import express from "express";
import {scrapeNaukri} from "../controllers/naukriController.js";
import {scrapeLinkedin} from "../controllers/linkedinController.js";
import {scrapeIndeed} from "../controllers/indeedController.js";
import {totalSearch} from "../controllers/searchContoller.js";
import {scrapeAll} from "../controllers/scrapeAllController.js";

const router = express.Router();

router.get('/search', totalSearch);
router.get('/scrape', scrapeAll);
router.get('/naukri', scrapeNaukri);
router.get('/linkedin', scrapeLinkedin);
router.get('/indeed', scrapeIndeed);

export default router;

