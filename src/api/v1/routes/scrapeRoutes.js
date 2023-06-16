import express from "express";
import {scrapeNaukri} from "../controllers/naukriController.js";
import {scrapeLinkedin} from "../controllers/linkedinController.js";
import {scrapeIndeed} from "../controllers/indeedController.js";
import {totalSearch} from "../controllers/searchContoller.js";

const router = express.Router();

router.get('/naukri', scrapeNaukri);
router.get('/linkedin', scrapeLinkedin);
router.get('/indeed', scrapeIndeed);
router.get('/search', totalSearch);

export default router;

