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
     dis : {
      type : String,
      lowercase : true,
      required : true,
     },
     createdBy : {
        type : mongoose.Types.ObjectId,
     },
     
     likes : {
      type : Number,
     },
     topics : {
      type : Array,
     }

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
      },
      userName : {
         type : String,
         unique : true,
         lowercase : true,
      },
      followers : {
         type : Array,
      },
      following : {
         type : Array,
      },
      search : {
           type : Array,
      },


}, { timestamps : true });

 const prompt = new mongoose.model('prompt', promptSchema);
 const login = new mongoose.model('login', loginSchema);

 module.exports = {
    login, prompt
 }
