let express = require('express');
let router = express.Router();

let jogosController = require('../controllers/jogos');
let indexController = require('../controllers/index');
let mongoose = require('mongoose');
const jogos = require('../models/jogos');
const { route } = require('.');

function isAdmin(req, res, next)
{
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    else
    {
        if(req.user.administrador == 'Sim')
        {
            next();
        }
        else
        {
            return res.redirect('/error');
        }
    }    
}

function requireAuth(req, res, next)
{
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}

router.get('/', isAdmin, jogosController.displayJogosList);

router.get('/palpitar', requireAuth, jogosController.displayPalpitarPage);
router.get('/palpitar/extras', requireAuth, jogosController.displayPalpitarExtrasPage);
router.get('/palpitar/extras/:bolaoID/:extraID/:userID', requireAuth, jogosController.DisplayPalpitandoExtraPage);
router.post('/palpitar/extras/:bolaoID/:extraID/:userID', requireAuth, jogosController.AddPalpiteExtra);
router.get('/palpitar/extras/edit/:bolaoID/:extraID/:userID', requireAuth, jogosController.DisplayEditPalpiteExtra);
router.post('/palpitar/extras/edit/:bolaoID/:extraID/:userID', requireAuth, jogosController.EditPalpiteExtra);

router.get('/palpitar/:bolaoID/:jogoID/:userID', requireAuth, jogosController.DisplayPalpitandoPage);
router.post('/palpitar/:bolaoID/:jogoID/:userID', requireAuth, jogosController.AddPalpite);

router.get('/palpitar/editar/:bolaoID/:jogoID/:userID', requireAuth, jogosController.DisplayEditarPalpitandoPage);
router.post('/palpitar/editar/:bolaoID/:jogoID/:userID', requireAuth, jogosController.EditPalpite);

router.get('/palpites', requireAuth, jogosController.DisplayPalpites);
router.post('/palpites', requireAuth, jogosController.DisplayPalpitesPart2);
router.get('/palpites/extras/:bolaoID', requireAuth, jogosController.DisplayAllPalpitesExtras);

router.get('/palpites/:jogoID', requireAuth, jogosController.DisplayAllPalpites);

router.get('/rankings', requireAuth, jogosController.displayRankings);

router.get('/ranking/:bolaoID', requireAuth, jogosController.displayOneRanking);




module.exports = router;