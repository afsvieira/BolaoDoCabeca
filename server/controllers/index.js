let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
const passport = require('passport');
const { register } = require('../models/admin');

//create a reference to the model
let Bolao = require('../models/bolao');
let Admin = require('../models/admin');
const { User } = require('../models/user');
let Palpites = require('../models/jogos');

module.exports.displayErrorPage = (req, res, next) => {
    res.render('error');
}

module.exports.displayHomePage = (req, res, next) => {    
    
    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('index', {title: 'Bolão do Cabeça',
                                username: req.user ? req.user.username: '', boloesList,
                                _id: req.user ? req.user.id: '',
                                administrador: req.user ? req.user.administrador: ''
                                });}});
}

module.exports.displayRegrasPage = (req, res, next) => {
let bolaoID = req.params.bolaoID;
let bolao = null

    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            if(bolaoID == null)
            {
                res.render('regras', { title: 'Regras',
                                username: req.user ? req.user.username: '', boloesList, bolao,
                                _id: req.user ? req.user.id: '',
                                administrador: req.user ? req.user.administrador: ''
                                });
            }
            else
            {
                Bolao.findById({'_id': bolaoID}, (err, bolao) => 
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.render('regras', { title: 'Regras',
                                username: req.user ? req.user.username: '', boloesList, bolao,
                                _id: req.user ? req.user.id: '',
                                administrador: req.user ? req.user.administrador: ''
                                });
                    }
                    
                });

            }
        }
    });      
}

module.exports.displayRankingPage = (req, res, next) => {

    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('index', { title: 'Ranking',
                                username: req.user ? req.user.username: '', boloesList,
                                _id: req.user ? req.user.id: '',
                                administrador: req.user ? req.user.administrador: ''
                                });}});
}


            

module.exports.displayContatoPage = (req, res, next) => {

    Bolao.find((err, boloesList) => {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('contato', { title: 'Contato',
                                    username: req.user ? req.user.username: '', boloesList,                   
                                    _id: req.user ? req.user.id: '',
                                    administrador: req.user ? req.user.administrador: ''
                                });}});
}

module.exports.displayLoginPage = (req, res, next) => {
    if(!req.user)
        {        
        res.render('auth/login',
        {
            title: 'Login',
            messages: req.flash('loginMessage'),
            username: req.user ? req.user.username : '',
            _id: req.user ? req.user.id: '',
            administrador: req.user ? req.user.administrador: ''
        });        
    }
    else
    {
        return res.redirect('/');
    }
}

module.exports.displayRegisterPage = (req, res, next) => {

    if(!req.user)
    {
        res.render('auth/register',
        {
            title: "CADASTRO",
            messages: req.flash('registerMessage'),
            username: req.user ? req.user.username : '',
            _id: req.user ? req.user.id: '',
            administrador: req.user ? req.user.administrador: ''
        });
    }
    else
    {
        return res.redirect('/');
    }
    
}

module.exports.processRegister = (req, res, next) => {
    let newUser = User({
        'name': req.body.name,        
        'username': req.body.username               
    });
    User.register(newUser, req.body.password, (err) => {
        if(err)
        {
            console.log(newUser);
            console.log('Error: Inserting new user');
            req.flash('registerMessage', 'E-mail já cadastrado.');
            if(err.email == 'UserExistsError')
            {
                req.Flash(
                    'registerMessage',
                    'E-mail já cadastrado!'
                );
                console.log('Error: User already existis!');
            }
            return res.render('auth/register', 
            {
                title: "CADASTRO",
                messages: req.flash('registerMessage'),
                username: req.user ? req.user.username : '',
                _id: req.user ? req.user.id: '',
                administrador: req.user ? req.user.administrador: ''
            });
        }
        else
        {
            //registration sucess
            console.log('Sucesso!');
            return passport.authenticate('local')(req, res, ()=> {
                res.redirect('/');
            });            
        }
    });
}

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local',
    (err, user, info) => {
        if(err)
        {
            return next(err);
        }
        if(!user)
        {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            if(err)
            {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}

module.exports.performLogout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}

module.exports.displayProfile = (req, res, next) => {
  
    let id = req.params.id;
    Admin.findById(id, (err, profileUser) => {
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
                    res.render('users/profile', {title: 'Profile', profileUser, boloesList, 
                    username: req.user ? req.user.username: '',
                    _id: req.user ? req.user.id: '',
                    administrador: req.user ? req.user.administrador: '' });}});

        }
        

    });
}


