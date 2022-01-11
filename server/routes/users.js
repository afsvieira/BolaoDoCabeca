let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let adminModel = require('../models/admin');
let Admin = require('../models/admin');
let Bolao = require('../models/bolao');


function isTheUser(req, res, next)
{
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    else
    {
        if(req.user._id == req.params.id)
        {
            next();
        }
        else
        {
            return res.render('users/error', {message: 'Unauthorized.'});
        }
    }    
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('placeholder');
});

router.get('/profile/edit/:id', isTheUser, function(req, res, next) {
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
                    res.render('users/edit', {title: 'EDITAR PROFILE', userToEdit, boloesList,
                    username: req.user ? req.user.username: '',
                    _id: req.user ? req.user.id: '',
                    administrador: req.user ? req.user.administrador: '' })}});
        }
    });
});

router.post('/profile/edit/:id', function(req, res, next) {
  let id = req.params.id
    

    Admin.findOneAndUpdate({_id: id}, { $set: {'name': req.body.name, 'apelido': req.body.apelido, 'username': req.body.username, 'time': req.body.time, 'img': req.body.img, 'bio': req.body.bio}}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/users/profile/'+id);
        }
    });    
}
);


module.exports = router;
