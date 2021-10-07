import NewOrg from "../model/NewOrg.js";
import { validateNewOrg } from "./validate.js";

//hashe pass
import bcrypt from "bcryptjs";

//START: Get Reg Org
const getRegOrg = async (req, res) => {
  try {
    const regOrgs = await NewOrg.find({}, { password: 0 });

    //DESC: Filter out relevant data

    res.status(200).send(regOrgs);
  } catch (error) {
    res.status(400).send(error);
  }
};

//START: Register Org

const registerOrg = async (req, res) => {
  const {
    orgName,
    address,
    directorName,
    email,
    firstNumber,
    secondNumber,
    password,
  } = req.body;

  //DESC: Validate New Org
  const { error } = validateNewOrg(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //DESC: Check if user exists
  const emailExists = await NewOrg.findOne({ email });

  if (emailExists) return res.status(400).send("Email already exists.");

  //DESC: Hash Password

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  //DESC: Register New Org
  const newOrg = new NewOrg({
    orgName,
    address,
    directorName,
    email,
    firstNumber,
    secondNumber,
    password: hashedPass,
  });

  //try org register

  try {
    const {
      orgName,
      address,
      directorName,
      email,
      firstNumber,
      secondNumber,
    } = await newOrg.save();

    res.send({
      orgName,
      address,
      directorName,
      email,
      firstNumber,
      secondNumber,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
//END: Register Org

export { registerOrg, getRegOrg };
