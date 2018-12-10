var mongoose = require('mongoose');
/*connecting to the databse*/

module.exports = function (config) {
    
    mongoose.connect(config.app.mlabUrl, {useNewUrlParser: true});

    mongoose.connection.on('error', function (err) {
        console.log('Error conencting to db');
        console.log('Make sure that you are connected to Internet')
    });
    mongoose.connection.once('open', function (done) {
        console.log('Successfully connected to MLab');
    });

}