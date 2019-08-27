const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * Register controller to create a new user
 * @param {*} req 
 * @param {*} res 
 */
function register(req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) { // validate required fields have been sent
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }
    const user = new User(); // create a new model instance
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password); // create salt and hash password using method defined in mongoose schema
    user.save((err) => {
        if (err) {
            res
                .status(404)
                .json(err);
        } else {
            // once saved, we want to return a JWT to the user
            const token = user.generateJwt();
            res
                .status(200)
                .json({ token });
        }
    });
}

/**
 * Controller called during login
 * @param {*} req 
 * @param {*} res 
 */
function login(req, res) {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }
    // use passport to authenticate the user
    passport.authenticate('local', (err, user, info) => {
        let token;
        if (err) { // when passport returns an error
            return res
                .status(404)
                .json(err);
        }
        if (user) {
            // if successful, send a JWT back to the user
            token = user.generateJwt();
            res
                .status(200)
                .json({ token });
        } else { // authentication failed
            res
                .status(401)
                .json(info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
};