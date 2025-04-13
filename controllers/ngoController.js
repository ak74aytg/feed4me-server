const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");
const NGO = require("../models/ngoSchema");
const NgoRequest = require("../requests/ngoRequest");
const OTP = require("../models/otpSchema");
const sendSMS = require("../services/smsService");
const bcrypt = require("bcryptjs");
const NGOContact = require("../models/ngoContactSchema");
const ngoContactSchema = require("../models/ngoContactSchema");
const Donation = require("../models/donationSchema");
const Farmer = require("../models/farmerSchema");
const Storage = require("../models/storageSchema");
const fs = require("fs");
const path = require("path");
const { json } = require("express");

const secretKey = process.env.TOKEN_SECRET;

const extractUsernameFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new CustomError("Invalid token", 401);
  }
};

const generateAccessToken = (username) => {
  return jwt.sign(username, secretKey);
};

const generateOTP = () => {
  const rand = Math.floor(10000 + Math.random() * 9000);
  return rand;
};

const registerNgo = async (req, res) => {
  const request = new NgoRequest(req.body);
  const email = request.email;
  try {
    let existingUser;
    if (email) {
      existingUser = await NGO.findOne({ email: request.email });
    }
    if (!existingUser) {
      existingUser = await NGO.findOne({
        registration_number: request.registration_number,
      });
    }
    if (existingUser) throw new CustomError("NGO already registered!", 400);
    const otp = generateOTP();
    console.log(otp);
    const body = `Dear customer, OTP to register with FEED4me is ${otp}. Please enter this code on the login page. Expires in 15 minutes.`;
    if (await OTP.findOne({ email }))
      await OTP.findOneAndUpdate({ email }, { otp, createdAt: new Date() });
    else await OTP.create({ email, otp });
    await sendSMS.sendEmail(body, email);
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(request.password, salt);
    request.password = hashedPass;
    req.session.pendingRegistration = request;
    return res
      .status(201)
      .json({ status: "OTP sent" });
  } catch (error) {
    if (error.status === "fail")
      return res.status(error.statusCode).send({ error: error.message });
    else return res.status(500).send({ error: error.message });
  }
};

const verifyNgo = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const pendingRegistration = req.session.pendingRegistration;
    if (!pendingRegistration)
      return res.status(400).json({ error: "Registration session expired" });
    const otpRecord = await OTP.findOne({ email: identifier });
    if (!otpRecord) throw new CustomError("OTP expired or invalid!", 404);
    if (otpRecord.otp !== otp) throw new CustomError("Invalid OTP!", 401);
    const newNGO = await NGO.create({
      name: pendingRegistration.name,
      registration_number: pendingRegistration.registration_number,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
      location: pendingRegistration.location,
      focusAreas: pendingRegistration.focus_area,
      establishment: pendingRegistration.establishment,
    });

    const newNGOContacts = await NGOContact.create({
      ngoId: newNGO._id,
      location: pendingRegistration.location,
      contactPerson: pendingRegistration.contact_person,
      contactPerson_phone: pendingRegistration.phone || null,
      website: pendingRegistration.website || null,
    });
    const token = generateAccessToken(newNGO.email);
    await OTP.deleteOne({ identifier });
    await NGO.create(newNGO);
    await NGOContact.create(newNGOContacts);
    const response = {};
    response._id = newNGO._id;
    response.name = newNGO.name;
    response.location = newNGOContacts.location;
    response.role = "ngo";
    response.email = newNGO.email;
    delete req.session.pendingRegistration;
    return res
      .status(201)
      .json({ status: "registration successful", data: response, token });
  } catch (error) {
    if (error.status === "fail")
      return res.status(error.statusCode).send({ error: error.message });
    else return res.status(500).send({ error: error.message });
  }
};

const loginNgo = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await NGO.findOne({
      $or: [{ registration_number: identifier }, { email: identifier }],
    });
    if (!user) throw new CustomError("Wrong credentials!", 401);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new CustomError("Wrong credentials!", 401);
    const token = generateAccessToken(user.email);
    const userContact = await NGOContact.findOne({ ngoId: user._id });
    const response = {};
    response._id = user._id;
    response.name = user.name;
    response.location = userContact.location;
    response.role = "ngo";
    response.email = user.email;
    return res.json({
      status: "Logged in successfully",
      data: response,
      token,
    });
  } catch (error) {
    if (error.status === "fail")
      return res.status(error.statusCode).send({ error: error.message });
    else return res.status(500).send({ error: error.message });
  }
};

const getNearbyNgos = async (req, res) => {
  try {
    const { latitude, longitude, radiusInKm = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ status: "fail", message: "Latitude and longitude are required." });
    }

    const contacts = await NGOContact.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radiusInKm * 1000,
        },
      },
    });

    const ngoIds = contacts.map(c => c.ngoId);
    const ngos = await NGO.find({ _id: { $in: ngoIds } });

    const mergedList = contacts.map((contact) => {
      const ngo = ngos.find(n => String(n._id) === String(contact.ngoId));
      const { ngoId, _id, ...contactData } = contact.toObject();
      return {
        _id: ngo?._id,
        ...ngo?.toObject(),
        ...contactData,
      };
    });

    return res.json({ status: "success", data: mergedList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "fail", message: error.message });
  }
};

const donateWaste = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
      return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    let user = await Farmer.findOne({
      $or: [{ mobile: identifier }, { email: identifier }],
    });
    if (!user) {
      user = await Storage.findOne({
        $or: [{ mobile: identifier }, { email: identifier }],
      });
    }
    if (!user)
      return res.status(402).send("token expired. Please login again!");
    const {
      donor,
      donorModel,
      ngo,
      wasteType,
      foodType,
      quantity,
      preparedOn,
      availableOn,
      collectionPoint,
      status,
    } = req.body;
    const location = JSON.parse(collectionPoint);
    const newDonation = new Donation({
      donor,
      donorModel,
      ngo,
      wasteType,
      foodType,
      quantity,
      preparedOn,
      availableOn,
      collectionPoint: location,
      status,
    });
    const savedDonation = await newDonation.save();
    if (req.file) {
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      const ext = path.extname(req.file.originalname);
      const fileName = `${savedDonation._id}-${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, req.file.buffer);
      savedDonation.imageUrl = `/uploads/${fileName}`;
      await savedDonation.save();
    }
    return res.json({ status: "success", donation: savedDonation });
  } catch (error) {
    console.log(error);
    if (error.status === "fail")
      return res.status(error.statusCode).send({ error: error.message });
    else return res.status(500).send({ error: error.message });
  }
};

const getDonations = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
      return res.status(403).send("A token is required for authentication");
    const identifier = extractUsernameFromToken(token);
    const user = await NGO.findOne({
      $or: [{ registration_number: identifier }, { email: identifier }],
    });
    if (!user)
      return res.status(402).send("token expired. Please login again!");
    const donations = await Donation.find({ ngo: user._id });
    const donationList = await Promise.all(
      donations.map(async (donation) => {
        let sender = await Farmer.findById(donation.donor);
        if (!sender) sender = await Storage.findById(donation.donor);
        const receiver = await NGO.findById(donation.ngo);
        const { donor, donorModel, ngo, ...info } = donation?.toObject() || {};
        return {
          donor_details: {
            id: sender?._id || null,
            name: sender?.name || null,
            phone: sender?.mobile || null,
            email: sender?.email || null,
            address: sender?.location || null
          },
          ngo_details: {
            id: receiver?._id || null,
            name: receiver?.name || null,
          },
          ...info
        };
      })
    );
    return res.json({ status: "success", data: donationList });
  } catch (error) {
    console.log(error);
    if (error.status === "fail")
      return res.status(error.statusCode).send({ error: error.message });
    else return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  registerNgo,
  verifyNgo,
  loginNgo,
  getNearbyNgos,
  donateWaste,
  getDonations,
};
