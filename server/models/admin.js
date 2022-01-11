let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');


//create a model class
let adminModel = mongoose.Schema({
    name: String,
    username: String,
    apelido: String,
    status: String,
    administrador: String,
    img: String,
    time: String,
    bio: String,
    inscrito: Array,    
},

{
    collection: "users",
    versionKey: false
});

let options = ({missingPassword: 'Senha Incorreta'});
adminModel.plugin(passportLocalMongoose, options);
module.exports = mongoose.model('Admin', adminModel);
