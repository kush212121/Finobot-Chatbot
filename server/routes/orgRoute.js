import { registerOrg, getRegOrg } from "../controller/orgController.js";

import express from "express";
const router = express.Router();

router.post("/register", registerOrg);
router.get("/register", getRegOrg);

export default router;
