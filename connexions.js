require ('dotenv').config();
const mongoose = require("mongoose");

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connecté");
    } catch (e) {
        console.log("Flop")
    }
}
module.exports = connectDB;