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
const customerRouter = require("./routes/customerRouter")
const paymentRouter = require("./routes/paymentRoute.js")
const reviewRouter = require("./routes/reviewRoute.js")

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
app.use('/api/public/images', express.static('uploads'));
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
app.use("/api/customer", customerRouter);
app.get("/api/donations/list", ngoController.getMyDonations)
app.use('/api/payment', paymentRouter);
app.use('/api/review', reviewRouter);


httpServer.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});



// / Reviews
// export interface Review {
//   id: string;
//   username: string;
//   userAvatar: string | null;
//   rating: number;
//   comment: string;
//   createdAt: string;
//   helpfulCount: number;
//   // votes?: string[]; // Uncomment if you manage voting
// }


// const reviews: Review[] = [
//   {
//     id: "r4",
//     username: "Amit Verma",
//     userAvatar: "https://example.com/avatar4.jpg",
//     rating: 4,
//     comment:
//       "Good app overall, but occasional lag when switching screens. Ads are not intrusive.",
//     createdAt: "2025-06-12T09:10:00Z",
//     deviceType: "Phone",
//     helpfulCount: 45,
//   },

//   {
//     id: "r6",
//     username: "Rohan Das",
//     userAvatar: "https://example.com/avatar6.jpg",
//     rating: 5,
//     comment:
//       "Highly recommend for casual and serious players alike. Clean design and no hassles.",
//     createdAt: "2025-07-15T07:40:00Z",
//     deviceType: "Tablet",
//     helpfulCount: 120,
//   },
// ];
// helpfulCount means like