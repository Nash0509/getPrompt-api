const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect('mongodb+srv://nishantsinghworkshard:nishantsinghworkshard@cluster0.53ldpxu.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log("The server is connected to the database...");
    })
    .catch((err) => {
        console.log("An error occured while connecting the server to the database... : "+err.message);
    })
}

module.exports = {connect};