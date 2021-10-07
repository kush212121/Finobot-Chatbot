import express from "express";
const router = express.Router();

import { getAllAgents, addAgent } from "../controller/agentController.js";

router.get("/:id/agent", getAllAgents);

router.post("/:id/agent", addAgent);

export default router;
