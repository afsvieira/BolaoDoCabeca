let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');


//create a model class
let jogosModel = mongoose.Schema({
    bolaoID: String,
    jogoID: String,
    userID: String,
    resultado_time1: Number,
    resultado_time2: Number,
    extraID: String,
    extraAnswer: String,    
    pontos: Number,
},

{
    collection: "jogos",
    versionKey: false
});

module.exports = mongoose.model('Palpites', jogosModel);

