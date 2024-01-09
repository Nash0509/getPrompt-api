const mongoose = require('mongoose');
require('dotenv').config()

const connect = () => {
    mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("The server is connected to the database...");
    })
    .catch((err) => {
        console.log("An error occured while connecting the server to the database... : "+err.message);
    })
}

module.exports = {connect};