const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('../routes/user')


const userschema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(v){
            if (!validator.isEmail(v)) throw new Error("Ce n'est pas un email valide !")
        }
    },
    password: {
        type: String,
        required: true,
        validate(v){
            if (!validator.isLength(v, {min: 8, max: 50})) throw new Error("Votre mot de passe est trop court !")
        }
    },
    genre: {
        type: String,
        required: true
    },
    pays: {
        type: String,
        required: true
    },
    addresse: {
        type: String,
        required: true
    }
});

userschema.methods.generateAuthTokenAndSave = async function() {
    const authToken = jwt.sign({ _id: this._id.toString() }, "test", { expiresIn: '1d' });
    try {
        return authToken;
    } catch (e) {
        console.error('Erreur :', e);
        throw e; 
    }
};

userschema.statics.findUser = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) throw new Error("Vos identifiants sont invalides !")
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Vos identifiants sont invalides !");
    return user;
}

userschema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
})

const User = mongoose.model('User', userschema);

module.exports = User;