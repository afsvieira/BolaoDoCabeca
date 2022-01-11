let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let adminController = require('../controllers/admin');
let jogosController = require('../controllers/jogos');
const admin = require('../models/admin');
const Bolao = require('../models/bolao');

function requireAuth(req, res, next)
{
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}

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

/* Get route for the admin list page - Read */
router.get('/', isAdmin, adminController.displayUsersList);

/* GET route for displaying add new user page - Create Operation */
router.get('/newuser', isAdmin, adminController.displayNewUserPage);

/* POST route for displaying new user page - Create Operation */
router.post('/newuser', isAdmin, adminController.processNewUser);

/* GET route for displaying edit user page - Update Operation */
router.get('/edit/:id', isAdmin, adminController.displayEditUserPage);

/* POST route for displaying add edit user page - UpdateOperation */
router.post('/edit/:id', isAdmin, adminController.processEditUser);

/* GET route for displaying UPDATE PASSWORD page - Update Operation */
router.get('/newpassword/:id/:username', isAdmin, adminController.displayUpdatePasswordPage);

/* POST route for displaying UPDATE PASSWORD page - UpdateOperation */
router.post('/newpassword/:id/:username', isAdmin, adminController.processUpdatePassword);

/* GET to perform deletion - Delete Operation */
router.get('/delete/:id', isAdmin, adminController.displayDeletePage);

/* POST route for delete user */
router.post('/delete/:id', isAdmin, adminController.processDeleteUser);

/* GET to PRE ADD GAME - Create Operation */
router.get('/preaddjogo', isAdmin, jogosController.displayPreAddJogo);

/* router.post('/preaddjogo', isAdmin, jogosController.processPreAddJogo); */

/* GET to ADD GAME - Create Operation */
router.get('/addjogo/:id', isAdmin, jogosController.displayAddJogo);

router.post('/addjogo/:id', isAdmin, jogosController.processAddJogo);



/* GET to ADD BOLAO - Create Operation */
router.get('/registerbolao', isAdmin, adminController.displayRegisterBolao);

router.post('/registerbolao', isAdmin, adminController.processRegisterBolaoFirstPart);

/* GET to ADD  and EDIT RESULT - Create Operation */

router.get('/addresultado', isAdmin, adminController.displayAddResultado);
router.get('/addresultado/:bolaoID', isAdmin, adminController.displayAddResultado2);
router.get('/jogo/addresultado/:bolaoID/:jogoID', isAdmin, adminController.displayAddingResultado);
router.post('/jogo/addresultado/:bolaoID/:jogoID', isAdmin, adminController.addingResultado);
router.get('/jogo/delete/:bolaoId/:jogoId', isAdmin, adminController.processDeleteJogo);
router.get('/jogo/removeresult/:bolaoID/:jogoID', isAdmin, adminController.removeResult);
router.get('/jogo/editdate/:bolaoID/:jogoID', isAdmin, adminController.displayEditDate);
router.post('/jogo/editdate/:bolaoID/:jogoID', isAdmin, adminController.processEditDate);
router.get('/addresultadoextra', isAdmin, adminController.displayAddResultadoExtra);
router.get('/addresultadoextra/:bolaoID', isAdmin, adminController.displayAddResultadoExtra2);
router.get('/jogo/extra/editdate/:bolaoID/:extraID', isAdmin, adminController.displayEditExtraDate);
router.post('/jogo/extra/editdate/:bolaoID/:extraID', isAdmin, adminController.editExtraDate);
router.get('/jogo/extra/addresultado/:bolaoID/:extraID', isAdmin, adminController.displayAddingExtraResultado);
router.get('/jogo/extra/removeresult/:bolaoID/:extraID', isAdmin, adminController.removeResultadoExtra);
router.post('/jogo/extra/addresultado/:bolaoID/:extraID', isAdmin, adminController.addingResultadoExtra);
router.get('/jogo/extra/delete/:bolaoID/:extraID', isAdmin, adminController.deleteExtra);
router.get('/addapostaextra/:bolaoID', isAdmin, adminController.DisplayAddExtra);
router.post('/addapostaextra/:bolaoID', isAdmin, adminController.AddingExtra);


module.exports = router;