const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String, // hash = encrypted(user's password + salt)
    salt: String
});

/**
 * Set password for a user
 * Made so process was abstracted away from user registration
 */
userSchema.methods.setPassword = function (password) {
    // in mongoose model methods, 'this' refers to the instance of the model itself
    this.salt = crypto.randomBytes(16).toString('hex'); // generate a cryptographically strong string
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512') // use password-based key derivation function 2,
        .toString('hex');
};

/**
 * Validate a password if a user was found
 * @returns Whether the password inputted matches the one in the database
 */
userSchema.methods.validPassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
        .toString('hex');
    return this.hash === hash;
};

/**
 * Create a JWT 
 * @returns A JWT
 */
userSchema.methods.generateJwt = function () {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // expiry is in 7 days
    return jwt.sign({
        _id: this._id, // payload
        email: this.email,// payload
        name: this.name,// payload
        exp: parseInt(expiry.getTime() / 1000, 10), // expiry of JWT so user has to login again after this
    }, process.env.JWT_SECRET); // JWT_SECRET is sent into this function for the hashing algorithim to use
};


mongoose.model('User', userSchema);