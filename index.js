const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bp = require('body-parser');
const connect = require('./database/dbconnect');
const schema = require('./database/models');
const cors = require('cors');
require('dotenv').config()
console.log(process.env.port)

connect.connect();

const key = 'destroy';

app.use(bp.json());
app.use(cors());

function auth(req, res, next) {

    const token = req.headers.token;

    if(!token) {
        console.log("No token found...");
        res.status(403).json({message : "No tken found..."});
    }

    jwt.verify(token, key, (err, decoded) => {

      if(err) {
        console.log("Invalid token...");
        res.status(403).send("Access denied...");
      }
      req.user = decoded;

    })

  
    next();

}



app.get('/', (req, res) => {
    console.log("The request is coming from the user...");
    res.send("Hello sir lets make the destroy webd.")
})

app.post('register/:email/:pass', async (req, res) => {

    try {

     
        const result = new schema.login({
              email : req.params.email,
              pass : req.params.pass,
        })

       await result.save();
        const token = jwt.sign({
            email : req.params.email,
            pass : req.params.pass,
      }, key, {expiresIn : '1h'})
        res.status(200).json({token : token});

    }
    catch (err) {

      console.log("The error occured during the registration");
      res.status(500).json({message : err.message});

    }

})


app.get('login/:email/:pass', async (req, res) => {

    try {

        const result = await schema.login.findOne({
            email : req.params.email,
            pass : req.params.pass,
        })

        if(!result) {
            console.log("No such user exists...");
            res.status(200).json({message : "404 not found..."})
        }

        const token = jwt.sign({
            email : req.params.email,
            pass : req.params.pass,
        }, key, {expiresIn : '1h'})
        res.status(200).json({token : token});

    }
    catch (err) {

      console.log("The error occured during the singin");
      res.status(500).json({message : err.message});

    }

})





app.listen(3001, () => {
    console.log(`The app is listening at the port ${process.env.port}`);
})