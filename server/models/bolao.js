let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');


//create a model class
let bolaoModel = mongoose.Schema({
    bolao: String,
    times: 
    [
        {
            name: String,
            img: String,
        },
                  
    ],
    jogos:
    [
        {
            time1: String,            
            resultado_time1: Number,
            time2: String,            
            resultado_time2: Number,
            date: Date,
            status: String,
            pointsMatch: Number,
            pointsWin: Number,
        },
    ],
    extras:
    [
        {
            extra: String,
            points: Number,
            resultado: String,
        },
        
    ],
    extrasDate: Date,
},

{
    collection: "bolao",
    versionKey: false
});


module.exports = mongoose.model('Bolao', bolaoModel);