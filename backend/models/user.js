const mongoose = require('mongoose')
const Schema=mongoose.Schema;
const bcrypt = require('bcrypt');
const userschema = new Schema({
    firstname: {
        type: String,
        require: true,
    },
    lastname: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: false,
        default:"gerant"
    },
    status: {
        type: Boolean,
        require: false,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    telephone: {
        type: String,
        require: true,
    },
    
    facture: [{
        type: Schema.Types.ObjectId,
        ref: "Facture",
    }],
    
    article: [{
        type: Schema.Types.ObjectId,
        ref: "Article",
    }],  

    depense: [{
        type: Schema.Types.ObjectId,
        ref: "Depense",
    }],  

})
userschema.pre('save',async function(next){
    const user =this;
    if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password,10)
    } 
  })

module.exports =mongoose.model('User',userschema);