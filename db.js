const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URI;


async function main() {
  await mongoose.connect
  (mongoUrl)
    .then(
    ()=>console.log('database connected')
  ).catch((e)=>console.log(e));
}


module.exports = main;