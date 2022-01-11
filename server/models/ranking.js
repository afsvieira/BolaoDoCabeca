let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');


//create a model class
let rankingModel = mongoose.Schema({
    bolao: String,
    jogo: String,
    user: String,
    extra: String,
    pontos: Number,
        
},

{
    collection: "ranking",
    versionKey: false
});


module.exports = mongoose.model('Ranking', rankingModel);
