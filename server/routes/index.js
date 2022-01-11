let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');
let jogosController = require('../controllers/jogos')
let mongoose = require('mongoose');
const admin = require('../models/admin');

function requireAuth(req, res, next)
{
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}


/* GET home page. */
router.get('/', indexController.displayHomePage);

/* GET error Page */
router.get('/error', indexController.displayErrorPage);

/* GET Regras page. */
router.get('/regras', indexController.displayRegrasPage);
router.get('/regras/:bolaoID', indexController.displayRegrasPage);

/* GET Ranking page. */
router.get('/ranking', indexController.displayRankingPage);

/* GET Palpites page. */
router.get('/palpitar', jogosController.displayPalpitarPage);

/* GET Contato page. */
router.get('/contato', indexController.displayContatoPage);

/* GET Login page. */
router.get('/login', indexController.displayLoginPage);

/* POST Login page. */
router.post('/login', indexController.processLoginPage);

/* GET Register Page */
router.get('/register', indexController.displayRegisterPage);

/* POST Register Page */
router.post('/register', indexController.processRegister);

/* GET to perform UserLogout */
router.get('/logout', indexController.performLogout);

/* GET profile USER */
router.get('/users/profile/:id', requireAuth, indexController.displayProfile);


module.exports = router
