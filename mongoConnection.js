const mongoose = require("mongoose");

async function connectToMongoDb() {
 try {
  const mongoUserName = process.env.MONGO_USERNAME;
  const mongoPassword = process.env.MONGO_PASSWORD;
  
  await mongoose.connect(
   `mongodb+srv://${mongoUserName}:${mongoPassword}@cluster0.4vfoxll.mongodb.net/`,
   { useNewUrlParser: true, useUnifiedTopology: true }
  );
  console.log("Connected to MongoDB");
 } catch (e) {
  console.log("Error connecting to MongoDB");
 }
}

module.exports = connectToMongoDb;
