//DESC:Validation
import Joi from "joi";

const validateNewOrg = (body) => {
  const schema = Joi.object({
    orgName: Joi.string().min(6).max(300).required(),
    address: Joi.string().min(6).max(1000).required(),
    directorName: Joi.string().min(6).max(300).required(),
    email: Joi.string().email().min(6).required(),
    firstNumber: Joi.number().required(),
    secondNumber: Joi.number(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(body);
};

export { validateNewOrg };
