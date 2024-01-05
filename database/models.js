const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({

     type : {
        type : String,
        required : true,
        lowercase : true,
     },
     prompt : {
        type : String,
        required : true,
        lowercase : true,
     },
     createdBy : {
        type : mongoose.Types.ObjectId,
     },

}, {timestamps : true});

const loginSchema = new mongoose.Schema({

      email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
      },
      pass : {
        type : String,
        required: true,
      }

}, { timestamps : true });

 const prompt = new mongoose.model('prompt', promptSchema);
 const login = new mongoose.model('login', loginSchema);

 module.exports = {
    login, prompt
 }