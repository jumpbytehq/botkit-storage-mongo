var mongoose = require('mongoose');
var AnySchema = new Schema({ any: {} });
/**
 * botkit-storage-mongo - MongoDB driver for Botkit
 *
 * @param  {Object} config Must contain a mongoUri property
 * @return {Object} A storage object conforming to the Botkit storage interface
 */
module.exports = function(config) {
    /**
     * Example mongoUri is:
     * 'mongodb://test:test@ds037145.mongolab.com:37145/slack-bot-test'
     * or
     * 'localhost/mydb,192.168.1.1'
     */
    if (!config || !config.mongooseConnection ) {
        throw new Error('Need to provide  moongoose connection.');
    }

    var db = mongooseConnection
        storage = {};

    ['teams', 'channels', 'users'].forEach(function(zone) {
        storage[zone] = getStorage(db, zone);
    });

    return storage;
};

/**
 * Creates a storage object for a given "zone", i.e, teams, channels, or users
 *
 * @param {Object} db A reference to the MongoDB instance
 * @param {String} zone The table to query in the database
 * @returns {{get: get, save: save, all: all}}
 */
function getStorage(db, zone) {
    var Zone = mongoose.model(zone, AnySchema);

    return {
        get: function(id, cb) {
            Zone.findOne({id: id}, cb);
        },
        save: function(data, cb) {
            Zone.findByIdAndModify({
                id: data.id
            }, data, {
                upsert: true,
                new: true
            }, cb);
        },
        all: function(cb) {
            Zone.find({}, cb);
        }
    };
}
