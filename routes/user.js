const express = require("express");
const User = require("../DB/users");
const authentification = require("../middlewares/authentification");
const connectDB = require("../connexions");
const mongoose = require("mongoose");
const db = mongoose.connection
const router = new express.Router();
const app = express();

router.get('/', async (req, res) => {
    let user = null;
    if (req.user) {
        user = req.user;
    }
    console.log(user)
    res.render('home', {
        title: "Acceuil",
        user: user
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
        console.log(e)
        res.status(400).send(e);
    }
});

router.get('/test', authentification, (req, res ) => {
    res.render('testttt')
})

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


router.get('/deconnexion', authentification, async (req, res) => {
    try {
        console.log('User ID:', req.user._id);
        console.log('Auth Token to remove:', req.authToken);
        console.log('Current Auth Tokens:', req.user.AuthTokens);
        await User.updateOne(
            { _id: req.user._id },
            { $pull: { AuthTokens: { AuthToken: req.authToken } } }
        );
        res.clearCookie('jwt');
        res.redirect('/');
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
});

module.exports = router;