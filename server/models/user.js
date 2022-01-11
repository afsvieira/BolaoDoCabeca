//require modules for the Yser Model

let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let User = mongoose.Schema(
    {
        username:
        {
            type: String,
            default: "",
            trim: true,
            required: 'email address is required'
        },
        name:
        {
            type: String,
            default: "",
            trim: true,
            required: 'Name is required'
        },
        created:
        {
            type: Date,
            default: Date.now()
        },
        administrador:
        {
            type: String,
            default: '',
            trim: true
        },
        img:
        {
            type: String
        },
       
    },
    {
        collection: "users",
        versionKey: false
    }
    
);

//configure options for user model

let options = ({missingPassword: 'Senha Incorreta'});
User.plugin(passportLocalMongoose, options);

module.exports.User = mongoose.model('User', User);