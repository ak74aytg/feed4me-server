require("dotenv").config();
const express = require("express");
const connectDB = require("./db.js");
const session = require('express-session')
const authRoute = require("./routes/authRoute");
const testRoute = require("./routes/testRoute");
const farmerRouter = require("./routes/farmerRouter");
const cropRouter = require("./routes/cropRoute")
const { Server } = require("socket.io");
const { createServer } = require("node:http")


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
app.use("/api/crops", cropRouter)
app.use("/api/test", testRoute);

io.on('connection', (socket) => {
  console.log("new user connected :" + socket.id);
  socket.emit('testing', "Hello World!");
})

httpServer.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});