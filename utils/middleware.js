const Database = require("../database");

module.exports = {

    validateQuery(...fields) {
        return (req, res, next) => {
            const data = req.method === 'GET' ? req.query : req.body;
            req.payload = {};
            for (const field of fields) {
                if (!data[field]) {
                    return res
                        .status(400)
                        .json({error: "missing one or more required parameters"})
                        .end();
                }
                req.payload[field] = data[field]
            }
            next();
        };
    },

    apiKey(...perms) {
        return async (req, res, next) => {
            const key = await Database.instance.getApiKey(req.headers.authorization && req.headers.authorization.startsWith("Bearer ") 
            ? req.headers.authorization.replace("Bearer", "").trim()
            : (req.query.key || req.body.key));
            if (!key) {
                return res
                    .status(401)
                    .header("WWW-Authenticate", 'Bearer realm="Access to the API", charset="UTF-8"')
                    .json({error: "Uauthorized"})
                    .end();
            }
            if (!(perms.every(perm => key.can(perm)) || key.can("*"))) {
                return res
                    .status(403)
                    .json({error: "missing permissions"})
                    .end();
            }
            next();
        }
    }

}