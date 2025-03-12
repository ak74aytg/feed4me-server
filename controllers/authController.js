const authService = require("../services/authService");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");


const secretKey = process.env.TOKEN_SECRET;

const extractUsernameFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};



//login controller
const loginController = async (req, res) => {
  const { role } = req.params;
  const { identifier, password } = req.body;
  try {
    const { user, token } = await authService.loginUser(identifier, password, role);
    res.json({ status: "Logged in successfully", data: user, token });
  } catch (error) {
    if (error.status === "fail") res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};



//register controller
const initialRegisterController = async (req, res) => {
  const { role } = req.params;
  const { name, email, mobile, password, age, location } = req.body;
  try {
    const { hashedPass, message } = await authService.initiateRegistration( email, mobile, password, role);
    req.session.pendingRegistration = { name, email, mobile, hashedPass, age, location, role };
    res.status(201).json({ status: "Registration successful", message });
  } catch (error) {
    if (error.status === "fail") res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};



//verify otp controller
const verifyRegisterController = async (req, res) => {
  try {
    const { role } = req.params;
    const { identifier, otp } = req.body;
    const pendingRegistration = req.session.pendingRegistration;
    // console.log(req.session)
    if (!pendingRegistration) return res.status(400).json({ error: "Registration session expired" });
    if(role != pendingRegistration.role) return res.status(400).json({error: "Invalid role specified"});
    const resp = await authService.verifyOTPAndRegister( identifier, otp, pendingRegistration, role );
    delete req.session.pendingRegistration;
    res.status(201).json(resp);
  } catch (error) {
    if (error.status === "fail") res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};



//delete profile controller
const deleteController = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]; 
    const { role } = req.params;
    if (!token) return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    await authService.deleteUser(identifier, role);
    res.status(200).json({ status: "Profile deleted successfully" });
  } catch (error) {
    if (error.status === "fail") res.status(error.statusCode).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
};







module.exports = {
  loginController,
  initialRegisterController,
  verifyRegisterController,
  deleteController,
};
