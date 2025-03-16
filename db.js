const mongoose = require('mongoose');
const periodicProcess = require("./utils/periodicProcess")

const mongoUrl = process.env.MONGO_URI;


async function main() {
  await mongoose.connect
  (mongoUrl)
    .then(
    ()=>{
      setInterval(()=>{
        periodicProcess.removeExpiredRentals();
      }, 1000 * 60 * 60 * 12);
      console.log('database connected');
    }
  ).catch((e)=>console.log(e));
}


module.exports = main;