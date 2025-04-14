require("dotenv").config();
const express = require("express");
const connectDB = require("./db.js");
const session = require('express-session')
const { Server } = require("socket.io");
const { createServer } = require("node:http")


const authRoute = require("./routes/authRoute");
const testRoute = require("./routes/testRoute");
const farmerRouter = require("./routes/farmerRouter");
const ngoRoute = require("./routes/ngoRoute")
const cropRouter = require("./routes/cropRoute")
const inventoryRoute = require("./routes/inventoryRoute")
const chatRouter = require("./routes/chatRoute.js");
const customerSchema = require("./routes/customerRouter")
const ngoController = require("./controllers/ngoController")

// Middlewares
const app = express();
const port = process.env.PORT | 3000;
connectDB();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
  }
});

require('./socket.js')(io);

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'));
app.use(express.static("public"));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 900000 } // 15 minutes
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoute);
app.use("/api/farmer", farmerRouter)
app.use("/api/inventory", inventoryRoute);
app.use("/api/crops", cropRouter)
app.use("/api/ngo", ngoRoute);
app.use("/api/test", testRoute);
app.use("/api/message", chatRouter);
app.use("/api/customer", customerSchema);
app.get("/api/donations/list", ngoController.getMyDonations)
httpServer.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});