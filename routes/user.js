const express = require("express");
const User = require("../DB/users");
const authentification = require("../middlewares/authentification");
const rendu = require("../middlewares/rendu");
const connectDB = require("../connexions");
const mongoose = require("mongoose");
const db = mongoose.connection
const jwt = require('jsonwebtoken');
const router = new express.Router();
const app = express();


router.get('/', rendu, async (req, res) => {
    res.render('home', {
        title: "Acceuil",
        user : req.user
    });
});

router.get('/inscription', (req, res) => {
    if (req.cookies.jwt) {
        return res.redirect('/');
    } else { 
        return res.render('Inscription', {
            title: "Inscription"
        });
    }
    
});

router.get('/moncompte', authentification, (req, res) => {
    res.render('moncompte', {
        title: "Mon compte",
        user : req.user
    })
})

router.post('/inscription', async (req, res) => {
    await db.collection('users').dropIndexes('authtoken');
    const user = await new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: req.body.password,
        genre: req.body.genre,
        pays: req.body.pays,
        addresse : req.body.addresse
    });
    try {
        if (req.body.password !== req.body.passwordconf){
            return res.redirect('inscription');
        } 
        const userSave = await user.save();
        res.redirect('seconnecter');
    } catch (e){
        res.redirect('inscription')
    }
});


router.get('/seconnecter', (req, res) => {
    if (req.cookies.jwt) {
        return res.redirect('/');
    }else {
        res.render('seconnecter', {
            title: "Connexion"
        });
    }
});

router.post('/seconnecter', async (req, res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password);
        const authToken = await user.generateAuthTokenAndSave();
        res.cookie('jwt', authToken, {httpOnly: true, secure: true});
        res.redirect('/');
    } catch(e) {
        console.log(e)
        res.redirect('/seconnecter')
    }
});

router.get('/deconnexion', async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.redirect('/');
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
});

module.exports = router;