const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost/Loc8r';

/**
 * Close mongoose connection, and display a message once done
 * @param {string} msg Message to display
 * @param {function} callback 
 */
function gracefulShutdown(msg, callback) {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};

//nodemon uses the SIGUSR2 signal
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// When a node application closes, it sends the 'SIGINT' signal
//Note: we need to emulate the SIGNINT event on some versions of windows
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});

// heroku uses the SIGTERM event
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

mongoose.connect(dbURI, { useNewUrlParser: true });


// TODO: need to handle closing the mongoose connection