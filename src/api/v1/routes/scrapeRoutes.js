import express from "express";
import {scrapeNaukri} from "../controllers/naukriController.js";

const router = express.Router();

router.get('/naukri', scrapeNaukri);

export default router;