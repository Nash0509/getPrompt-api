const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bp = require('body-parser');
const connect = require('./database/dbconnect');
const schema = require('./database/models');
const cors = require('cors');
const random = require('./utilities/randomname');
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
       return res.status(403).json({message : "1"});
      }
      next();

    })

}



app.get('/', (req, res) => {
    console.log("The request is coming from the user...");
    res.send("Hello sir lets make the destroy webd.")
})

app.post('/register/:email/:pass', async (req, res) => {

    try {

     
        const result =  new schema.login({
              email : req.params.email,
              pass : req.params.pass,
              userName : random.randomName(),
        })

        const abc = await result.save();

        const token = jwt.sign({
            email : req.params.email,
            pass : req.params.pass,
      }, key, {expiresIn : '1h'})

      return res.status(200).json({token : token , id : abc._id});

    }
    catch (err) {

      console.log("The error occured during the registration : "+err.message);
    return res.status(500).json({message : err.message});

    }

})


app.get('/login/:email/:pass', async (req, res) => {

    try {

        const result = await schema.login.findOne({
            email : req.params.email,
            pass : req.params.pass,
        })

        if(!result) {
            console.log("No such user exists...");
            return res.status(404).json({message : "404 not found..."})
        }

        const token = jwt.sign({
            email : req.params.email,
            pass : req.params.pass,
        }, key, {expiresIn : '1h'})

      return res.status(200).json({token : token, id : result._id});

    }
    catch (err) {

      console.log("The error occured during the singin");
      return res.status(500).json({message : err.message});

    }

})

app.post('/create', auth ,async (req, res) => {

    console.log("The create req is coming")

    try {

       const result = new schema.prompt({
            type : req.body.type,
            prompt : req.body.prompt,
            createdBy : req.body.createdBy,
            dis : req.body.dis,
            likes : 0,
       })

       await result.save();

       res.status(200).json({message : "Your prompt have been saved successfully!"});

    }
    catch (err) {
        console.log("Error from the create endpoint : "+err.message);
        res.status(500).json({message : `An error occured ${err.message}`});
    }

})

app.get('/cards', async (req, res) => {

    try {

        const result = await schema.prompt.find({
            type : 'Programming',
        })
        const result2 = await schema.prompt.find({
            type : 'Project Ideas',
        })

        if(!result || !result2) {
            console.log("Not found he cards fetching : ");
            return result.status(404).json({message : "404 not found"});
        }

        return res.status(200).json({result, result2});
    }
    catch (err) {
        console.log(err.message  + ": Error from the cards end point...");
        return res.status(500).json({message : err.message});
    }

})

app.get('/cards1/:id', async (req, res) => {

    console.log("Reached the cards1");

    try {

        const result = await schema.prompt.findById(req.params.id);

        if(!result) {
            console.log("Not found he cards fetching : ");
            return res.status(404).json({message : "404 not found"});
        }
        console.log(result);

        return res.status(200).json([result]);
    }
    catch (err) {
        console.log(err.message  + ": Error from the cards end point...");
        return res.status(500).json({message : err.message});
    }

})

app.get('/getUser/:id', async (req, res) => {

     console.log("came to the getUser...!!")

    try {
  
        const result = await schema.login.findById(req.params.id);

        if(!result) {
            console.log("Not found the getUser fetching : ");
            return res.status(404).json({message : "404 not found"});
        }      

        return res.status(200).json([result]);
    }
    catch (err) {
        console.log(err.message  + ": Error from the getUser end point...");
        return res.status(500).json({message : err.message});
    }

})

app.get('/getUserPrompts/:id', async (req, res) => {

    try {
  
        const result = await schema.prompt.find({
            createdBy : req.params.id,
        });

        if(!result) {
            console.log("Not found the getUser fetching : ");
            return res.status(404).json({message : "404 not found"});
        }      

        return res.status(200).json(result);
    }
    catch (err) {
        console.log(err.message  + ": Error from the getUser end point...");
        return res.status(500).json({message : err.message});
    }

})

app.patch('/changename', auth ,async (req, res) => {

       console.log("came to the change name...!!")  

    try {
  
        const result = await schema.login.updateOne({_id : req.body.id}, {$set : {userName : req.body.userName}});   

        if(!result) {
            console.log("Unique name read");
            return res.status(404).json({message : "This username is not available..."})
        }

        return res.status(200).json({code : '200', result : result});
    }
    catch (err) {
        console.log(err.message  + ": Error from the Update name end point...");
        return res.status(500).json({message : err.message});
    }


})

app.patch('/editprompt', async (req, res) => {

     console.log("Reached the edit Prompt");

    try {

     const result = await schema.prompt.updateOne({_id : req.body.id}, {$set : {dis : req.body.dis, prompt : req.body.prompt}});

     if(!result) {
        console.log("Somthing unexpected happened ");
        return res.status(404).json({message : "Somthing unexpected happened"});
     }

     return res.status(200).json(result);

    }
    catch (err) {

        console.log(err.message  + ": Error from the Update name end point...");
        return res.status(500).json({message : err.message});

    }

})

app.patch('/upvote', async (req, res) => {

   try {

   const result = await schema.prompt.updateOne({_id : req.body.id}, {
    $inc : {likes : 1 }
   })

   if(!result) {
      console.log("Not found from upvote");
      return res.status(404).json({message : "Somthing unexpected happened"});
   }

   return res.status(200).json({message : result});

   }
   catch (err) {

    console.log(err.message  + ": Error from the upvote end point...");
    return res.status(500).json({message : err.message});

   }

})
app.patch('/downvote', async (req, res) => {

    console.log("Reached the down vote...")

   try {

   const result = await schema.prompt.updateOne({_id : req.body.id}, {
    $inc : {likes : -1 }
   })

   if(!result) {
      console.log("Not found from upvote");
      return res.status(404).json({message : "Somthing unexpected happened"});
   }

   return res.status(200).json({message : result});

   }
   catch (err) {

    console.log(err.message  + ": Error from the upvote end point...");
    return res.status(500).json({message : err.message});

   }

})

app.patch('/follow', auth ,async (req, res) => {

   console.log("Reached the follow endpoint");

   try {

     const result = await schema.login.updateOne({_id : req.body.route}, {$push : {followers : req.body.storage}})

     const result2 = await schema.login.updateOne({_id : req.body.storage}, {$push : {following : req.body.route}});

     if(!result || !result2) {
        console.log("Follower not added...");
        return res.status(404).json({message : "Not followed..."});
     }

     return res.status(200).json({result : result, result2 : result2});

   }
   catch (err) {

    console.log("Error from the follow end point: " + err.message);
    return res.status(500).json({message : err.message});

   } 

})

app.patch('/unfollow', auth ,async (req, res) => {

    console.log("Reached the unfollow endpoint");
 
    try {
 
        const result = await schema.login.updateOne({_id : req.body.route}, {$pull : {followers : req.body.storage}})

        const result2 = await schema.login.updateOne({_id : req.body.storage}, {$pull : {following : req.body.route}});
 
      if(!result || !result2) {
         console.log("Follower not added...");
         return res.status(404).json({message : "Not followed..."});
      }
 
      return res.status(200).json({result : result, result2 : result2});
 
    }
    catch (err) {
 
     console.log("Error from the unfollow end point: " + err.message);
     return res.status(500).json({message : err.message});
 
    } 
 
 })

 app.patch('/addType', auth ,async (req, res) => {

    console.log("Was in the addType..."+ req.body.topic);

    try {

     const result = await schema.prompt.updateOne({_id : '659cf25dff29fa4f2aff7afe'}, {$push : {topics : req.body.topic}});

     if(!result) {
        console.log("Not inserted the type...");
        return res.status(404).json({message : "Not inserted the type"});
     }
      
     console.log(result);

     return res.status(200).json(result);

    }
    catch (err) {

        console.log("Error from the addType end point: " + err.message);
        return res.status(500).json({message : err.message});

    }

 })

 app.get('/getTypes', async (req, res) => {

    console.log("GetTypes me aaya tha...");

    try {

     const result = await schema.prompt.findById('659cf25dff29fa4f2aff7afe');

     if(!result) {
        console.log("Not found...");
        return res.status(404).json({message : "404 not found..."});
     }

     return res.status(200).json(result);

    }
    catch (err) {

      console.log("error from the getTypes..."+err.message);
      return res.status(500).json({message : err.message});
    }

 })

 app.get('/search/:search', async (req, res) => {

      try {

        const result = await schema.prompt.find({
            type : req.params.search,
        })

        if(!result) {
            console.log("No such types exists...");
            return res.status(404).json({message : "0"});
        }

        return res.status(200).json(result);

      }
      catch (err) {

        console.log("error from the search..."+err.message);
        return res.status(500).json({message : err.message});

      }

 })
 

app.listen(process.env.port, () => {
    console.log(`The app is listening at the port ${process.env.port}`);
})