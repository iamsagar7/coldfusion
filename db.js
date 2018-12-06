var mongoose = require('mongoose');
/*connecting to the databse*/

module.exports = function (config) {
    
    mongoose.connect(config.app.mlabUrl, {useNewUrlParser: true});

    mongoose.connection.on('error', function (err) {
        console.log('error conencting to db');
    });
    mongoose.connection.once('open', function (done) {
        console.log('successfully connected to db');
    });

}