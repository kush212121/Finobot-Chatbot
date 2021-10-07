import mongoose from "mongoose";

import Agent from "../model/Agent.js";
import NewOrg from "../model/NewOrg.js";

//DESC: Get All Agents
const getAllAgents = async (req, res) => {
  const orgId = req.params.id;

  //DESC: Check if organization exists
  if (!mongoose.Types.ObjectId.isValid(orgId))
    return res.status("404").send("Invalid Id");

  try {
    const orgExists = await NewOrg.findOne({ _id: orgId });
    if (!orgExists) return res.status(200).send({ error: "Org doesnt exist" });
  } catch (error) {
    console.log({ error });
    return res.status(500).send(error);
  }

  //DESC: Get agents
  try {
    const agents = await Agent.find({ orgId });
    return res.status(200).send(agents);
  } catch (error) {
    return res.status(400).send(error);
  }
};

//DESC: Add Agent
const addAgent = async (req, res) => {
  const { name, email, password } = req.body;

  const orgId = req.params.id;

  //DESC: Check if organization exists
  if (!mongoose.Types.ObjectId.isValid(orgId))
    return res.status("404").send("Invalid Id");

  try {
    const orgExists = await NewOrg.findOne({ _id: orgId });
    if (!orgExists) return res.status(200).send({ error: "Org doesnt exist" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "server error" });
  }

  //DESC: Check if agent exists
  try {
    const agentExists = await Agent.findOne({ email });
    if (agentExists) return res.status(400).send("Agent already exists");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }

  //DESC: Create New Agent

  const agent = new Agent({
    name,
    email,
    password,
    orgId,
  });

  try {
    const savedAgent = await agent.save();
    return res.send(savedAgent);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }

  return res.send("success");
};

export { getAllAgents, addAgent };
