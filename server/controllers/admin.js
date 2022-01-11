let express = require('express');
let Router = express.Router();
let mongoose = require('mongoose');
let locus = require('locus');
let fs = require('fs');
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout); 
const passport = require('passport');
const { register } = require('../models/admin');

//create a reference to the model
let Bolao = require('../models/bolao');
let Palpites = require('../models/jogos');
let Admin = require('../models/admin');
let Ranking = require('../models/ranking');
const { User } = require('../models/user');
const ranking = require('../models/ranking');


function getBoloes() {
    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(boloesList)
        }

    })
};

module.exports.displayUsersList = (req, res, next) => {
    
    Admin.find((err, usersList) => {
        if(err)
        {
            return console.error(err);            
        }
        else
        {
            Bolao.find((err, boloesList) => {
                if(err)
                {
                    console.log(err)
                }
                else{
                    
                res.render('admin/users', { title: 'Admin',
                                            usersList, boloesList,
                                            username: req.user ? req.user.username: '',
                                            _id: req.user ? req.user.id: '',
                                            administrador: req.user ? req.user.administrador: ''
                                        });                                     
            }
        }).sort({'name': 1, '_id': 1});}});
}

module.exports.displayNewUserPage = (req, res, next) => {
   
    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('admin/newuser', {title: 'CADASTRAR NOVO USUÁRIO', messages: req.flash('newUserMessage'), boloesList,
                                        username: req.user ? req.user.username: '',
                                        _id: req.user ? req.user.id: '',
                                        administrador: req.user ? req.user.administrador: ''});
        }});
}


module.exports.processNewUser = (req, res, next) => {
    let newUser = Admin({
        'name': req.body.name,
        'apelido': req.body.apelido,
        'username': req.body.username,        
        'status': req.body.status,
        'administrador': req.body.admin,
    });
    Admin.register(newUser, req.body.password, (err) => {
        if(err)
        {
            console.log(newUser);
            console.log(err);
            req.flash('newUserMessage', 'E-mail já cadastrado!');
            if(err.email == 'UserExistsError')
            {
                req.Flash(
                    'newUserMessage',
                    'E-mail já cadastrado!'
                );
                console.log('Error: User already existis!');
            }
            else
            {
                req.flash(
                    'newUserMessage',
                    'Erro ao capturar os dados do novo usuário.'
                );
                
            }
            return res.render('admin/newuser', {title: 'CADASTRAR NOVO USUÁRIO', messages: req.flash('newUserMessage')});      
        }
        else
        {
            //registration sucess
            console.log('Sucesso!');
            res.redirect('/admin');
                      
        }
    });
}

module.exports.displayEditUserPage = (req, res, next) => {
    
    let id = req.params.id;
    Admin.findById(id, (err, userToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
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
                    res.render('admin/edit', {title: 'EDITAR USUÁRIO', userToEdit, boloesList,
                    username: req.user ? req.user.username: '',
                    _id: req.user ? req.user.id: '',
                    administrador: req.user ? req.user.administrador: '' });}});

        }
        

    });
}

module.exports.processEditUser = (req, res, next) => {
    let id = req.params.id
    let updateUser = Admin({
        '_id': id,
        'name': req.body.name,
        'apelido': req.body.apelido,
        'username': req.body.username,        
        'status': req.body.status,
        'administrador': req.body.admin,
        'inscrito': req.body.bolaoInscrito,
    });

    Admin.updateOne({_id: id}, updateUser, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/admin');
        }
    });    
}

module.exports.displayUpdatePasswordPage = (req, res, next) => {
    
    let id = req.params.id;
    Admin.findById(id, (err, userToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
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
                    res.render('admin/newpassword', {title: 'ALTERAR SENHA DO USUÁRIO', userToEdit, boloesList,
                    username: req.user ? req.user.username: '',
                    _id: req.user ? req.user.id: '',
                    administrador: req.user ? req.user.administrador: ''} );}});
        }
        

    })
    
}

module.exports.processUpdatePassword = (req, res, next) => {
    
    let id = req.params.id    
    User.findById(id, (err, updateUser) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            updateUser.setPassword(req.body.password, (err, updateUser) => {
                if (err)
                {
                    console.log(err);            
                }
                else
                {
                    console.log(updateUser);
                    updateUser.save();
                    res.redirect('/admin');
                }
            });
        }    
    });      
}

module.exports.displayDeletePage = (req, res, next) => {
    let id = req.params.id;
    Admin.findById(id, (err, userToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
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
                    res.render('admin/delete', {title: 'Tem certeza que gostaria de remover o seguinte usuário?', userToEdit, boloesList,
                    username: req.user ? req.user.username: '',
                    _id: req.user ? req.user.id: '',
                    administrador: req.user ? req.user.administrador: ''} );}});
        }
    });   

}

module.exports.processDeleteUser = (req, res, next) => {
    let id = req.params.id;

    Admin.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/admin');
        }
    });
}
module.exports.displayRegisterBolao = (req, res, next) => {
    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('admin/registerbolao', {title: 'Criar novo bolão', boloesList,
                                        username: req.user ? req.user.username: '',
                                        _id: req.user ? req.user.id: '',
                                        administrador: req.user ? req.user.administrador: ''});}});
}

module.exports.processRegisterBolaoFirstPart = (req, res, next) => {
    if(!req.body.time1)
    {
        let bolaoName = req.body.bolaoName;
        let numTimes = req.body.numTimes;
        let numExtras = req.body.numExtras;
        Bolao.find((err, boloesList) => {
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.render('admin/registerbolao2', {title: 'Criar novo bolão',
                                                    username: req.user ? req.user.username: '', boloesList,
                                                    _id: req.user ? req.user.id: '',
                                                    administrador: req.user ? req.user.administrador: '',
                                                    bolaoName, numTimes, numExtras}); }});
        }
    
    else
    {
        let numTimes = req.body.numTimes;
        let numExtras = req.body.numExtras;
        let extrasDateReg = new Date(req.body.extrasDate);
        let currentTimeZone = extrasDateReg.getTimezoneOffset();
        extrasDateReg.setMinutes(extrasDateReg.getMinutes() + currentTimeZone);
        let timesReg = [];
        let extrasReg = [];
        for(i = 1; i <= numTimes; i++)
        {
            timesReg.push({name: req.body['time' + i], img: req.body['img_time' + i]});
        }
        for(i = 1; i <= numExtras; i++)
        {
            extrasReg.push({extra: req.body['extra' + i], points: req.body['points' + i]});
        }
        
        let newBolao = Bolao({
            bolao : req.body.bolaoName,
            times: timesReg,
            extras: extrasReg,
            extrasDate: extrasDateReg,                          
           
        });
        Bolao.create(newBolao, (err) => {
            if(err){
                console.log(err);
            }
            else
            {
                res.redirect('/');
            }});    
    }
    }
    
    module.exports.displayAddResultado = (req, res, next) => {
        Bolao.find((err, boloesList) => {
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.render('admin/addresultado', {title: 'Adicionar resultado', boloesList,
                                            username: req.user ? req.user.username: '',
                                            _id: req.user ? req.user.id: '',
                                            administrador: req.user ? req.user.administrador: ''});}});
    }

    module.exports.displayAddResultado2 = (req, res, next) => 
    {
       let bolaoID = req.params.bolaoID;
       Bolao.find((err, boloesList) => {
            if(err)
            {
                console.log(err)
            }
            else
            {        
                Bolao.find({'_id': bolaoID}, (err, bolao) => 
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.render('admin/addresultado2', {title: 'Adicionar resultado', bolao, boloesList,
                        username: req.user ? req.user.username: '',
                        _id: req.user ? req.user.id: '',
                        administrador: req.user ? req.user.administrador: ''});
                    }
                });
            }
       });
    }

    module.exports.displayAddingResultado = (req, res, next) => 
    {
        let bolaoID = req.params.bolaoID;
        let jogoID = req.params.jogoID;
       Bolao.find((err, boloesList) => {
            if(err)
            {
                console.log(err)
            }
            else
            {        
                Bolao.find({'_id': bolaoID}, (err, bolao) => 
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.render('admin/addingresultado', {title: 'Adicionar resultado', bolao, boloesList, jogoID,
                        username: req.user ? req.user.username: '',
                        _id: req.user ? req.user.id: '',
                        administrador: req.user ? req.user.administrador: ''});
                    }
                });
            }
       });
    }

    module.exports.addingResultado = (req, res, next) => 
    {
        let bolaoID = req.params.bolaoID;
        let jogoID = req.params.jogoID;
        let resultado_time1 = req.body.resultado_time1;
        let resultado_time2 = req.body.resultado_time2;
        let vencedor = '';
        let pointsWin = '';
        let pointsMatch = '';
        if(resultado_time1 - resultado_time2 > 0 ) 
        {
            vencedor = 'Time1';
        }
        if(resultado_time1 - resultado_time2 < 0 ) 
        {
            vencedor = 'Time2';
        }
        if(resultado_time1 - resultado_time2 == 0 ) 
        {
            vencedor = 'empate';
        }
        Bolao.findOne({'_id': bolaoID, 'jogos._id': jogoID}, (err, jogo) => 
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                jogo.jogos.forEach(currentGame =>
                    {
                        if(currentGame._id == jogoID)
                        {
                            pointsMatch = currentGame.pointsMatch;
                            pointsWin = currentGame.pointsWin;
                        }
                    });                
            }
        });       
        
        Bolao.updateOne({'_id': bolaoID, jogos: {$elemMatch: {_id: jogoID}}}, {'jogos.$.resultado_time1': resultado_time1, 'jogos.$.resultado_time2': resultado_time2 }, (err, result) => 
        {
            if(err)
            {
                console.log(err);
            }
            else
            {                
                console.log(result);
            }
        });
        Palpites.find({'bolaoID': bolaoID, 'jogoID': jogoID}, (err, palpites) => 
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log(palpites);
                palpites.forEach(palpite => 
                    {
                        let palpiteVencedor = '';
                        if(palpite.resultado_time1 - palpite.resultado_time2 > 0 ) 
                        {
                            palpiteVencedor = 'Time1';
                        }
                        if(palpite.resultado_time1 - palpite.resultado_time2 < 0 ) 
                        {
                            palpiteVencedor = 'Time2';
                        }
                        if(palpite.resultado_time1 - palpite.resultado_time2 == 0 ) 
                        {
                            palpiteVencedor = 'empate';
                        }
                        if(palpite.resultado_time1 == resultado_time1 && palpite.resultado_time2 == resultado_time2)                        {
                                                       
                            Ranking.updateOne({'bolao': bolaoID, 'jogo': jogoID, 'user': palpite.userID },{'bolao': bolaoID, 'jogo': jogoID, 'user': palpite.userID, 'pontos': pointsMatch}, {upsert: true}, (err, update) =>
                            {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    console.log(update);
                                }
                            });
                        }                        
                        else
                        {
                            if(palpiteVencedor == vencedor)
                            {
                                Ranking.updateOne({'bolao': bolaoID, 'jogo': jogoID, 'user': palpite.userID },{'bolao': bolaoID, 'jogo': jogoID, 'user': palpite.userID, 'pontos': pointsWin}, {upsert: true}, (err, update) =>
                            {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    console.log(update);
                                }
                            });
                            }
                            else
                            {
                                Ranking.updateOne({'bolao': bolaoID, 'jogo': jogoID, 'user': palpite.userID },{'bolao': bolaoID, 'jogo': jogoID, 'user': palpite.userID, 'pontos': 0}, {upsert: true}, (err, update) =>
                            {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    console.log(update);
                                }
                            });
                            }                            
                        }                        
                    });
                }
        });
        
        res.redirect('/admin/addresultado');

    }

    module.exports.processDeleteJogo = (req, res, next) => {
        let jogoId = req.params.jogoId;
        let bolaoId = req.params.bolaoId;
    
        Bolao.updateOne({'_id': bolaoId}, {$pull: {jogos: {'_id': jogoId}}}, (err, result) => 
        {
            if(err)
            {
                console.log(err);                
            }
            else
            {
                console.log(result)
                ranking.deleteMany({'jogo': jogoId}, (err, deleted) => 
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log(deleted);
                        Palpites.deleteMany({'jogoID': jogoId}, (err, deletedRanking) =>
                        {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                console.log(deletedRanking);
                                res.redirect('/admin/addresultado');
                            }
                        });
                    }

                });
            }
        });
    }

    module.exports.removeResult = (req, res, next) => 
    {
        let bolaoID = req.params.bolaoID;
        let jogoID = req.params.jogoID;
        let resultado_time1 = '';
        let resultado_time2 = '';
             
        Bolao.updateOne({'_id': bolaoID, jogos: {$elemMatch: {_id: jogoID}}}, {'jogos.$.resultado_time1': resultado_time1, 'jogos.$.resultado_time2': resultado_time2 }, (err, result) => 
        {
            if(err)
            {
                console.log(err);
            }
            else
            {                
                console.log(result);
                ranking.deleteMany({'jogo': jogoID}, (err, deletedRanking) =>
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log(deletedRanking);
                        res.redirect('/admin/addresultado');
                    }
                });
            }
        });
    }

    module.exports.displayEditDate = (req, res, next) => 
    {
       let bolaoID = req.params.bolaoID;
       let jogoID = req.params.jogoID;
       Bolao.find((err, boloesList) => {
            if(err)
            {
                console.log(err)
            }
            else
            {        
                Bolao.find({'_id': bolaoID}, (err, bolao) => 
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.render('admin/editdate', {title: 'Editar data', bolao, boloesList, jogoID,
                        username: req.user ? req.user.username: '',
                        _id: req.user ? req.user.id: '',
                        administrador: req.user ? req.user.administrador: ''});
                    }
                });
            }
       });
    }

module.exports.processEditDate = (req, res, next) => 
{
    let bolaoID = req.params.bolaoID;
    let jogoID = req.params.jogoID;
    let date = req.body.date;
    let gameDate = new Date(date);
    let currentTimeZone = gameDate.getTimezoneOffset();
    gameDate.setMinutes(gameDate.getMinutes() + currentTimeZone);                          
    Bolao.updateOne({'_id': bolaoID, jogos: {$elemMatch: {_id: jogoID}}}, {'jogos.$.date': gameDate}, (err, result) => 
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(result);
            res.redirect('/admin/addresultado');
        }
    });
}

module.exports.displayAddResultadoExtra = (req, res, next) => {
    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('admin/addresultadoextra', {title: 'Adicionar resultado extra', boloesList,
                                        username: req.user ? req.user.username: '',
                                        _id: req.user ? req.user.id: '',
                                        administrador: req.user ? req.user.administrador: ''});
        }
    });
}

module.exports.displayAddResultadoExtra2 = (req, res, next) => 
    {
       let bolaoID = req.params.bolaoID;
       Bolao.find((err, boloesList) => {
            if(err)
            {
                console.log(err)
            }
            else
            {        
                Bolao.find({'_id': bolaoID}, (err, bolao) => 
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.render('admin/addresultadoextra2', {title: 'Adicionar resultado extra', bolao, boloesList, bolaoID,
                        username: req.user ? req.user.username: '',
                        _id: req.user ? req.user.id: '',
                        administrador: req.user ? req.user.administrador: ''});
                    }
                });
            }
       });
    }

    module.exports.displayEditExtraDate = (req, res, next) => 
    {
       let bolaoID = req.params.bolaoID;
       let extraID = req.params.extraID;
       Bolao.find((err, boloesList) => {
            if(err)
            {
                console.log(err)
            }
            else
            {        
                Bolao.find({'_id': bolaoID}, (err, bolao) => 
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.render('admin/editextradate', {title: 'Editar data limite', bolao, boloesList, extraID,
                        username: req.user ? req.user.username: '',
                        _id: req.user ? req.user.id: '',
                        administrador: req.user ? req.user.administrador: ''});
                    }
                });
            }
       });
    }

    module.exports.editExtraDate = (req, res, next) => 
    {
        let bolaoID = req.params.bolaoID;        
        let date = req.body.date;
        let dataLimite = new Date(date);
        let currentTimeZone = dataLimite.getTimezoneOffset();
        dataLimite.setMinutes(dataLimite.getMinutes() + currentTimeZone);                          
        Bolao.updateOne({'_id': bolaoID}, {'extrasDate': dataLimite}, (err, result) => 
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log(result);
                res.redirect('/admin/addresultadoextra');
            }
        });
    }

module.exports.displayAddingExtraResultado = (req, res, next) =>
{
    let bolaoID = req.params.bolaoID;
    let extraID = req.params.extraID;
       Bolao.find((err, boloesList) => {
            if(err)
            {
                console.log(err)
            }
            else
            {        
                Bolao.find({'_id': bolaoID}, (err, bolao) => 
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.render('admin/addingresultadoextra', {title: 'Adicionar resultado de aposta extra', bolao, boloesList, extraID,
                        username: req.user ? req.user.username: '',
                        _id: req.user ? req.user.id: '',
                        administrador: req.user ? req.user.administrador: ''});
                    }
                });
            }
       });
}

module.exports.removeResultadoExtra = (req, res, next) => 
    {
        let bolaoID = req.params.bolaoID;
        let extraID = req.params.extraID;
        let resultado = null;        
             
        Bolao.updateOne({'_id': bolaoID, extras: {$elemMatch: {_id: extraID}}}, {'extras.$.resultado': resultado}, (err, result) => 
        {
            if(err)
            {
                console.log(err);
            }
            else
            {                
                console.log(result);
                ranking.deleteMany({'jogo': extraID}, (err, deletedRanking) =>
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log(deletedRanking);
                        res.redirect(req.get('referer'));
                    }
                });
            }
        });
    }

module.exports.addingResultadoExtra = (req, res, next) => 
{
    let bolaoID = req.params.bolaoID;
    let extraID = req.params.extraID;
    let resultado = req.body.extraAnswer;
    let points = '';

    Bolao.findOne({'_id': bolaoID, 'extras._id': extraID}, (err, extra) => 
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            extra.extras.forEach(currentExtra => 
                {
                    if(currentExtra._id == extraID)
                    {
                        points = currentExtra.points;
                    }
                });
        }
    });

    Bolao.updateOne({'_id': bolaoID, extras: {$elemMatch: {_id: extraID}}}, {'extras.$.resultado': resultado}, (err, result) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(result);
        }
    });

    Palpites.find({'bolaoID': bolaoID, 'extraID': extraID}, (err, palpites) => 
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            palpites.forEach(palpite => 
                {
                    if(palpite.extraAnswer == resultado)
                    {
                        Ranking.updateOne({'bolao': bolaoID, 'jogo': extraID, 'user': palpite.userID}, {'bolao': bolaoID, 'jogo': extraID, 'user': palpite.userID, 'pontos': points}, {upsert: true}, (err, update) =>
                        {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                console.log(update);
                            }
                        });
                    }
                    else
                    {
                        Ranking.updateOne({'bolao': bolaoID, 'jogo': extraID, 'user': palpite.userID}, {'bolao': bolaoID, 'jogo': extraID, 'user': palpite.userID, 'pontos': 0}, {upsert: true}, (err, update) =>
                        {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                console.log(update);
                                
                            }
                        });
                    }
                });
        }
    });
    res.redirect('/admin/addresultadoextra/' + bolaoID);

}

module.exports.deleteExtra = (req, res, next) =>
{
    let extraID = req.params.extraID;
    let bolaoID = req.params.bolaoID;
    
    Bolao.updateOne({'_id': bolaoID}, {$pull: {extras: {'_id': extraID}}}, (err, result) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(result);
            ranking.deleteMany({'jogo': extraID}, (err, deleted) =>
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log(deleted);
                    Palpites.deleteMany({'extraID': extraID}, (err, deletedPalpites) =>
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            console.log(deletedPalpites);
                            res.redirect('/admin/addresultadoextra/' + bolaoID);
                        }
                    });
                }        
            });
        }
    });
}

module.exports.DisplayAddExtra = (req, res, next) =>
{
    let bolaoID = req.params.bolaoID;
    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err)
        }
        else
        {        
            Bolao.find({'_id': bolaoID}, (err, bolao) => 
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    res.render('admin/addapostaextra', {title: 'Adicionar aposta extra', bolao, boloesList, bolaoID,
                    username: req.user ? req.user.username: '',
                    _id: req.user ? req.user.id: '',
                    administrador: req.user ? req.user.administrador: ''});
                }
            });
        }
   });
}

module.exports.AddingExtra = (req, res, next) =>
{
    let bolaoID = req.params.bolaoID;
    let extraAdding = req.body.extraAdding;
    let pointsAdding = req.body.pointsAdding;

    Bolao.updateOne({'_id': bolaoID}, {$push: {'extras': {'extra': extraAdding, 'points': pointsAdding}}}, (err, updated) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(updated);
            res.redirect('/admin/addapostaextra/' + bolaoID);
        }

    });
}

