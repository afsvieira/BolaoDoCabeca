let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
const passport = require('passport');
const { register } = require('../models/jogos');
let moment = require('moment');
let Bolao = require('../models/bolao');
let Admin = require('../models/admin')

//create a reference to the model
let Palpites = require('../models/jogos');
const { User } = require('../models/user');
const bolao = require('../models/bolao');
const admin = require('../models/admin');
const ranking = require('../models/ranking');



module.exports.displayJogosList = (req, res, next) => {    
            
    Bolao.find((err, boloesList) => 
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('admin/jogos', { title: 'Lista de Jogos',
                                        boloesList,
                                        username: req.user ? req.user.username: '',
                                        _id: req.user ? req.user.id: '',
                                        administrador: req.user ? req.user.administrador: ''
                                    });
        }
    });                                 
}    


module.exports.displayJogoPage = (req, res, next) => {
    let jogosList = Jogos.find((err, jogosList) => {
        if(err)
        {
            return console.error(err);            
        }
        else
        {
            return jogosList;
        }
    });
    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('jogos/palpitar', {title: 'Palpitar', jogosList, boloesList,
                                username: req.user ? req.user.username: '',
                                _id: req.user ? req.user.id: '',
                                administrador: req.user ? req.user.administrador: ''
                                });}});
}

module.exports.displayAddJogo = (req, res, next) => {     
    let idBolao = req.params.id;
    Bolao.findById(idBolao, (err, bolaoSelected) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            Bolao.find((err, boloesList) => {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    res.render('admin/addjogo', {title: 'Adicionar novo jogo',
                                            username: req.user ? req.user.username: '', boloesList, bolaoSelected,
                                            _id: req.user ? req.user.id: '',
                                            administrador: req.user ? req.user.administrador: ''}
                                            );
                }
            });
        }
    });   
    }

module.exports.displayPreAddJogo = (req, res, next) => {
        
    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('admin/preaddjogo', {title: 'Adicionar novo jogo',
                                    username: req.user ? req.user.username: '', boloesList,
                                    _id: req.user ? req.user.id: '',
                                    administrador: req.user ? req.user.administrador: ''});
        }
    });
}
    

 
module.exports.processAddJogo = (req, res, next) => {
    if(req.body.time1 == req.body.time2){
        console.log('Times iguais');
        res.redirect('admin/addjogo');
    }
    else {
        let idBolao = req.params.id;
        Bolao.findById(idBolao, (err, bolaoSelected) => {
            if(err)
            {
                console.log(err);
            }
            else                        
            
            {   
                let gameDate = new Date(req.body.date);
                let currentTimeZone = gameDate.getTimezoneOffset();
                gameDate.setMinutes(gameDate.getMinutes() + currentTimeZone);                          
                Bolao.updateOne({'_id': idBolao}, {$push: {'jogos': {'time1': req.body.time1, 'time2': req.body.time2,                                                                    
                                                                    'date': gameDate, 'status': 'aberto',
                                                                    'pointsMatch': req.body.pointsMatch, 'pointsWin': req.body.pointsWin}
                                                                }},(err) => {
                    if(err)
                    {
                        console.log(err);
                        req.flash('newJogoMessage', 'Erro ao cadastrar novo jogo.');
                        return res.render('jogos/addjogo', {title: 'Adicionar novo jogo', messages: req.flash('newJogoMessage')});      
                    }
                    else
                    {
                        //registration sucess                        
                        Bolao.findOne({'_id': idBolao},
                                     {_id: 0, jogos: {$elemMatch: {time1: req.body.time1, time2: req.body.time2, date: gameDate}}},
                                     (err, jogoCreated) =>
                        {                            
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                jogoCreated.jogos.forEach(element => {
                                    let jogoID = element.id;
                                    Palpites.update({'bolaoID': idBolao}, {$push: {'jogos': {'jogoID': jogoID}}}, (err) =>
                                    {
                                        if(err)
                                        {
                                            console.log(err);
                                        }
                                        else
                                        {
                                            console.log('Sucesso!');                        
                                            res.redirect('/');  
                                        }
                                    });                                
                                });
                            }
                        });                            
                    }
                });
            }
        });
    }
}

module.exports.DisplayPalpitandoPage = (req, res, next) => {    
    let jogoID = req.params.jogoID;
    let userID = req.params.userID;       
    Admin.findById({'_id': req.user.id}, function(err, userData) {
        if(err)
        {
            console.log(err)
        }
        else
        {                
            Bolao.find({'bolao': {'$in' : userData.inscrito}}, (err, boloesList) =>  
            {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    res.render('jogos/palpitando', { title: 'Palpintando',
                                                boloesList, jogoID, userID,
                                                username: req.user ? req.user.username: '',
                                                _id: req.user ? req.user.id: '',
                                                administrador: req.user ? req.user.administrador: ''
                                            });
                }
            });
        }                                 
});
}

module.exports.AddPalpite = (req, res, next) => 
{
    let bolaoID = req.params.bolaoID;
    let userID = req.params.userID;
    let jogoID = req.params.jogoID;
    let resultado_time1 = req.body.resultado_time1;
    let resultado_time2 = req.body.resultado_time2;

    Palpites.create({'bolaoID': bolaoID,
                        'jogoID': jogoID,
                        'userID': userID,
                        'resultado_time1': resultado_time1,
                        'resultado_time2': resultado_time2}, (err) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {                                 
            console.log('Sucesso!');
            res.redirect('/jogos/palpitar');   

        }
    });
}

module.exports.displayPalpitarPage = (req, res, next) => {

    
    Admin.findById({'_id': req.user.id}, function(err, userData) {
        if(err)
        {
            console.log(err)
        }
        else
        {                
            Bolao.find({'bolao': {'$in' : userData.inscrito}}, (err, boloesList) => {
                if(err)
                {
                    console.log(err)
                }
                else
                {       
                        Palpites.find({'userID': req.user.id}, (err, userPalpites) => {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                
                                ranking.find({'user': req.user.id}, (err, pontos) => 
                                    {
                                        if(err)
                                        {
                                            console.log(err);
                                        }
                                        else
                                        {                                          
                                            
                                            res.render('jogos/palpitar', { title: 'Palpitar',
                                            username: req.user ? req.user.username: '', boloesList, userData, userPalpites, pontos,
                                            _id: req.user ? req.user.id: '',
                                            administrador: req.user ? req.user.administrador: '',
                                            inscrito: req.user ? req.user.inscrito: '',
                                            });
                                        }
                                    });
                                
                            }
                        });
                }
            });   
        }
    });
}


module.exports.DisplayEditarPalpitandoPage = (req, res, next) => {    
    let jogoID = req.params.jogoID;
    let userID = req.params.userID;       
    Admin.findById({'_id': req.user.id}, function(err, userData) {
        if(err)
        {
            console.log(err)
        }
        else
        {                
            Bolao.find({'bolao': {'$in' : userData.inscrito}}, (err, boloesList) =>  
            {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    Palpites.findOne({'userID': req.user.id, 'jogoID': jogoID}, (err, palpite) => {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            res.render('jogos/editarpalpite', { title: 'Palpintando',
                                                boloesList, jogoID, userID, palpite,
                                                username: req.user ? req.user.username: '',
                                                _id: req.user ? req.user.id: '',
                                                administrador: req.user ? req.user.administrador: ''
                                            });
                        }});
                }
            });
        }                                 
});
}

module.exports.EditPalpite = (req, res, next) => 
{
    let bolaoID = req.params.bolaoID;
    let userID = req.params.userID;
    let jogoID = req.params.jogoID;
    let resultado_time1 = req.body.resultado_time1;
    let resultado_time2 = req.body.resultado_time2;

    Palpites.updateOne({'jogoID': jogoID, 'userID': userID}, 
                        {'resultado_time1': resultado_time1,
                        'resultado_time2': resultado_time2}, (err) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {                                 
            console.log('Sucesso!');
            res.redirect('/jogos/palpitar');   

        }
    });
}

module.exports.DisplayPalpites = (req, res, next) =>
    {
        Admin.findById({'_id': req.user.id}, function(err, userData) {
            if(err)
            {
                console.log(err)
            }
            else
            {                
                Bolao.find({'bolao': {'$in' : userData.inscrito}}, (err, boloesList) =>  
                {
                    if(err)
                    {
                        console.log(err)
                    }
                    else
                    {
                         res.render('jogos/prepalpites', {title: 'Palpites', boloesList,
                                            username: req.user ? req.user.username: '',
                                            _id: req.user ? req.user.id: '',
                                            administrador: req.user ? req.user.administrador: ''
                                            });
                    }
                });
            }
    });
    }

    module.exports.DisplayPalpitesPart2 = (req, res, next) =>
    {
        bolaoID = req.body.bolaoID;
        Bolao.findById(bolaoID, (err, bolao) => {
            if(err)
            {
                console.log(err)
            }
            else
            {
                Bolao.find((err, boloesList) => 
                {
                    if(err)
                    {
                        console.log(err)
                    }
                    else
                    {
                        res.render('jogos/palpites', {title: bolao.bolao, boloesList, bolao,
                                                username: req.user ? req.user.username: '',
                                                _id: req.user ? req.user.id: '',
                                                administrador: req.user ? req.user.administrador: ''
                                                });
                    }
                });
                    
            }
        });
    }

module.exports.DisplayAllPalpites = (req, res, next) =>
    {
        jogoID = req.params.jogoID;
        Palpites.find({'jogoID': jogoID}, (err, palpites) => 
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                Bolao.find((err, boloesList) => 
                {
                    if(err)
                    {
                        console.log(err)
                    }
                    else
                    {
                        Admin.find((err, userList) =>
                        {
                            if(err)
                            {
                                console.log(err);                                
                            }
                            else
                            {
                                ranking.find({'jogo': jogoID}, (err, pontuacao) => 
                                {
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        res.render('jogos/allpalpites', {title: bolao.bolao, boloesList, palpites, userList, jogoID, pontuacao,
                                            username: req.user ? req.user.username: '',
                                            _id: req.user ? req.user.id: '',
                                            administrador: req.user ? req.user.administrador: ''
                                            });
                                    }
                                })
                                
                            }
                        });
                    }
                });

            }
        });
    }
    
    module.exports.displayRankings = (req, res, next) => 
{
    
    Admin.findById({'_id': req.user.id}, function(err, userData) {
        if(err)
        {
            console.log(err)
        }
        else
        {                
            Bolao.find({'bolao': {'$in' : userData.inscrito}}, (err, boloesList) =>  
            {
                if(err)
                {
                    console.log(err)
                }
                else
                {                 
                    
                         res.render('jogos/rankings', {title: 'Ranking', boloesList, userData,
                                        username: req.user ? req.user.username: '',
                                        _id: req.user ? req.user.id: '',
                                        administrador: req.user ? req.user.administrador: ''
                                        });

                }
            });
                     
        }
    });
}

module.exports.displayOneRanking = (req, res, next) => 
{
    bolaoID = req.params.bolaoID;
    Admin.findById({'_id': req.user.id}, function(err, userData) {
        if(err)
        {
            console.log(err)
        }
        else
        {                
            Bolao.findById({'_id': bolaoID}, (err, bolao) =>  
            {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    Bolao.find({'bolao': {'$in' : userData.inscrito}}, (err, boloesList) =>  
                    {
                        if(err)
                        {
                            console.log(err)
                        }
                        else
                        {
                            Admin.find({'inscrito': bolao.bolao}, (err, inscritos) => 
                            {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    ranking.find({'bolao': bolaoID}, (err, pontuacao) => 
                                    {
                                        if(err)
                                        {
                                            console.log(err);
                                        }
                                        else
                                        {
                                            res.render('jogos/displayranking', {title: 'Ranking', bolao, userData, inscritos, pontuacao, boloesList,
                                                username: req.user ? req.user.username: '',
                                                _id: req.user ? req.user.id: '',
                                                administrador: req.user ? req.user.administrador: ''
                                                });
                                        }
                                    });
                                    
                                }
                            });
                        }
                    }); 
                }

            });
        }
});
}

module.exports.displayPalpitarExtrasPage = (req, res, next) => {

    
    Admin.findById({'_id': req.user.id}, function(err, userData) {
        if(err)
        {
            console.log(err)
        }
        else
        {                
            Bolao.find({'bolao': {'$in' : userData.inscrito}}, (err, boloesList) => {
                if(err)
                {
                    console.log(err)
                }
                else
                {       
                        Palpites.find({'userID': req.user.id}, (err, userPalpites) => {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                
                                ranking.find({'user': req.user.id}, (err, pontos) => 
                                    {
                                        if(err)
                                        {
                                            console.log(err);
                                        }
                                        else
                                        {                                          
                                            
                                            res.render('jogos/palpitarextras', { title: 'Palpites Extras',
                                            username: req.user ? req.user.username: '', boloesList, userData, userPalpites, pontos,
                                            _id: req.user ? req.user.id: '',
                                            administrador: req.user ? req.user.administrador: '',
                                            inscrito: req.user ? req.user.inscrito: '',
                                            });
                                        }
                                    });
                                
                            }
                        });
                }
            });   
        }
    });
}

module.exports.DisplayPalpitandoExtraPage = (req, res, next) => {    
    let extraID = req.params.extraID;
    Admin.findById({'_id': req.user.id}, function(err, userData) {
        if(err)
        {
            console.log(err)
        }
        else
        {                
            Bolao.find({'bolao': {'$in' : userData.inscrito}}, (err, boloesList) => {
                if(err)
                {
                    console.log(err)
                }
                else
                {       
                        Palpites.find({'userID': req.user.id}, (err, userPalpites) => {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                
                                ranking.find({'user': req.user.id}, (err, pontos) => 
                                    {
                                        if(err)
                                        {
                                            console.log(err);
                                        }
                                        else
                                        {                                          
                                            
                                            res.render('jogos/palpitandoextra', { title: 'Palpitar Extra',
                                            username: req.user ? req.user.username: '', extraID, boloesList, userData, userPalpites, pontos,
                                            _id: req.user ? req.user.id: '',
                                            administrador: req.user ? req.user.administrador: '',
                                            inscrito: req.user ? req.user.inscrito: '',
                                            });
                                        }
                                    });
                                
                            }
                        });
                }
            });   
        }
    });
}

module.exports.AddPalpiteExtra = (req, res, next) => 
{
    let bolaoID = req.params.bolaoID;
    let userID = req.params.userID;
    let extraID = req.params.extraID;
    let extraAnswer = req.body.extraAnswer;

    Palpites.create({'bolaoID': bolaoID,
                        'extraID': extraID,
                        'userID': userID,
                        'extraAnswer': extraAnswer}, (err) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {                                 
            console.log('Sucesso!');
            res.redirect('/jogos/palpitar/extras');   

        }
    });
}

module.exports.DisplayEditPalpiteExtra = (req, res, next) =>
{
    let extraID = req.params.extraID;
    let userID = req.params.userID;       
    Admin.findById({'_id': req.user.id}, function(err, userData) {
        if(err)
        {
            console.log(err)
        }
        else
        {                
            Bolao.find({'bolao': {'$in' : userData.inscrito}}, (err, boloesList) =>  
            {
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    Palpites.find({'userID': req.user.id}, (err, userPalpites) => {
                        if(err)
                        {
                            console.log(err)
                        }
                        else
                        {
                            Palpites.findOne({'userID': req.user.id, 'extraID': extraID}, (err, palpite) => {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    
                                    res.render('jogos/editarpalpiteextra', { title: 'Palpintando',
                                                        boloesList, extraID, userID, palpite, userPalpites,
                                                        username: req.user ? req.user.username: '',
                                                        _id: req.user ? req.user.id: '',
                                                        administrador: req.user ? req.user.administrador: ''
                                                    });
                                }});

                        }
                    });
                    
                }
            });
        }                                 
});
}

module.exports.EditPalpiteExtra = (req, res, next) => 
{
    let bolaoID = req.params.bolaoID;
    let userID = req.params.userID;
    let extraID = req.params.extraID;
    let extraAnswer = req.body.extraAnswer;    

    Palpites.updateOne({'extraID': extraID, 'userID': userID}, 
                        {'extraAnswer': extraAnswer}, (err) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {                                 
            console.log('Sucesso!');
            res.redirect('/jogos/palpitar/extras');   

        }
    });
}

module.exports.DisplayAllPalpitesExtras = (req, res, next) =>
{
    let bolaoID = req.params.bolaoID;
    
    Bolao.findById({'_id': bolaoID}, (err, bolao) => 
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            Admin.find({'inscrito': bolao.bolao}, (err, userList) =>
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    Palpites.find((err, palpitesList) =>
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            ranking.find({'bolao': bolaoID}, (err, pontos) =>
                            {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    res.render('jogos/palpitesextras', { title: 'Palpites Extras',
                                    bolao, userList, palpitesList, pontos,
                                    username: req.user ? req.user.username: '',
                                    _id: req.user ? req.user.id: '',
                                    administrador: req.user ? req.user.administrador: ''
                                })
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
