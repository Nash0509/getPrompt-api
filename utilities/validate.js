
const Joi = require('joi') 

const validate = (data) => {

    const joiSchema = Joi.object({

      email : Joi.string().email(),
      password : Joi.string().min(4)
                             
     } )

     return joiSchema.validate(data);

}

module.exports = {validate};