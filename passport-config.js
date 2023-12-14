const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Your database setup
const db = require('./database');

module.exports = function (passport) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        // Match user
        const user = await findUserByUsername(username);
        if (!user) {
            return done(null, false, { message: 'That username is not registered' });
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        });
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        // Your code to find user by ID
        db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
            done(err, row);
        });
    });
};
async function findUserByUsername(username) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};
