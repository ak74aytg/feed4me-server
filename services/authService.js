const Farmers = require("../models/farmerSchema");
const Customers = require("../models/customerSchema");
const Storage = require("../models/storageSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendSMS = require("./smsService");
const OTP = require("../models/otpSchema");
const CustomError = require("../utils/customError");



const secretKey = process.env.TOKEN_SECRET;

const generateAccessToken = (username) => {
  return jwt.sign(username, secretKey);
};

const generateOTP = () => {
  const rand = Math.floor(10000 + Math.random() * 9000);
  return rand;
};


//login service
const loginUser = async (identifier, password, role) => {
  let Model;
  switch (role.toLowerCase()) {
    case "farmer":
      Model = Farmers;
      break;
    case "customer":
      Model = Customers;
      break;
    case "storage":
      Model = Storage;
      break;
    default:
      throw new CustomError("Invalid role specified", 400);
  }
  const user = await Model.findOne({ $or: [{ mobile: identifier.toString() }, { email: identifier }] });
  if (!user) throw new CustomError("Wrong credentials!", 401);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new CustomError("Wrong credentials!", 401);
  const token = user.mobile ? generateAccessToken(user.mobile) : generateAccessToken(user.email);
  const response = {};
  response._id = user._id;
  response.name = user.name;
  response.age = user.age;
  response.location = user.location;
  response.role = role;
  response.mobile = user.mobile || null;
  response.email = user.email || null;
  return { user : response, token };
};


//register service
const initiateRegistration = async (email, mobile, password, role) => {
  let Model;
  switch (role.toLowerCase()) {
    case "farmer":
      Model = Farmers;
      break;
    case "customer":
      Model = Customers;
      break;
    case "storage":
      Model = Storage;
      break;
    default:
      throw new CustomError("Invalid role specified", 400);
  }
  let existingUser;
  if(mobile){
    existingUser = await Model.findOne({ mobile });
  }else{
    existingUser = await Model.findOne( { email: email });
  }
  if (existingUser) throw new CustomError("User already registered!", 400);
  const otp = generateOTP();
  //   const to = "+91" + mobile;
  const to = "+917819977069";
  const body = `Dear customer, OTP to register with FEED4me is ${otp}. Please enter this code on the login page. Expires in 15 minutes.`;
  if(mobile){
    if (await OTP.findOne({ mobile })) await OTP.findOneAndUpdate({ mobile },{ otp, createdAt: new Date() });
    else await OTP.create({ mobile, otp });
    await sendSMS.createMessage(body, to);
  }else{
    if(await OTP.findOne({ email })) await OTP.findOneAndUpdate({ email }, {otp, createdAt: new Date() });
    else await OTP.create({email, otp});
    await sendSMS.sendEmail(body, email);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  const message = "OTP sent successfully";
  return { hashedPass, message };
};


//verify otp service
const verifyOTPAndRegister = async (identifier, otp, pendingRegistration, role) => {
  let Model;
  switch (role.toLowerCase()) {
    case "farmer":
      Model = Farmers;
      break;
    case "customer":
      Model = Customers;
      break;
    case "storage":
      Model = Storage;
      break;
    default:
      throw new CustomError("Invalid role specified", 400);
  }
  const otpRecord = await OTP.findOne({ $or: [{ mobile: identifier.toString() }, { email: identifier }] });
  if (!otpRecord) throw new CustomError("OTP expired or invalid!", 404);
  if (otpRecord.otp !== otp) throw new CustomError("Invalid OTP!", 401);
  const newUser = await Model.create({
    name: pendingRegistration.name,
    email: pendingRegistration.email || undefined,
    mobile: pendingRegistration.mobile || undefined,
    password: pendingRegistration.hashedPass,
    age: pendingRegistration.age,
    location: pendingRegistration.location,
  });
  const token = newUser.mobile ? generateAccessToken(newUser.mobile) : generateAccessToken(newUser.email);
  await OTP.deleteOne({ identifier });
  await Model.create(newUser);

  const response = {};
  response._id = newUser._id;
  response.name = newUser.name;
  response.age = newUser.age;
  response.location = newUser.location;
  response.role = role;
  response.mobile = newUser.mobile || null;
  response.email = newUser.email || null;
  return { status: "Registration successful", data: response, token };
};


//delete user service
const deleteUser = async (identifier, role) => {
  let Model;
  switch (role.toLowerCase()) {
    case "farmer":
      Model = Farmers;
      break;
    case "customer":
      Model = Customers;
      break;
    case "storage":
      Model = Storage;
      break;
    default:
      throw new CustomError("Invalid role specified!", 400);
  }
  await Model.findOneAndDelete({ $or: [{ mobile: identifier.toString() }, { email: identifier }] });
};

module.exports = {
  initiateRegistration,
  verifyOTPAndRegister,
  loginUser,
  deleteUser,
};
