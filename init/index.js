require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

const initDB = async () => {
  console.log(process.env.MONGO_URI);
  await Listing.deleteMany({});
  await User.deleteMany({});
  // Create Admin User
    const admin = new User({
        email: "admin@gmail.com",
        username: "admin",
    });

    // passport-local-mongoose
    const registeredAdmin = await User.register(admin, "admin123");

    console.log("Admin Created");

    // Assign owner to every listing
    const listings = initData.data.map((obj) => ({
        ...obj,
        owner: registeredAdmin._id,
    }));

    await Listing.insertMany(listings);

    console.log("Database Initialized");
};

initDB();