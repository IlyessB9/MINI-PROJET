const jwt = require('jsonwebtoken');
const User = require('../DB/users')
const cookieParser = require('cookie-parser');

const authentification = async (req, res, next) => {
    try {
        const authToken = req.cookies.jwt
        const verify = jwt.verify(authToken, 'test');
        const user = await User.findById( {_id : verify._id});
    
        if (!user) throw new Error("Utilisateur introuvable !")
        req.authToken = authToken;
        req.user = user;
        
        next();
    } catch (e) {
        console.log(e);
    }
};

module.exports = authentification;