const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
    key: String,
    owner: String,
    permissions: [String]
})
apiKeySchema.methods.can = function(perm) {
    return this.permissions.includes(perm);
}

module.exports = class Database {

    static instance = null;

    constructor(connection) {
        this.connection = connection;
        this.apiKeys = mongoose.model('apiKey', apiKeySchema);
    }
    

    async getApiKey(key) {
        return await this.apiKeys.findOne({key: key}).exec();
    }

    static connect(uri=null) {
        mongoose.connect(uri || process.env.MONGO_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
        return this.instance = new Database(mongoose.connection);
    }
}
