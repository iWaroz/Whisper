module.exports = {
    validateQuery(fields) {
        return (req, res, next) => {
            for (const field of fields) {
                if (!req.query[field]) {
                    return res
                        .status(400)
                        .send(`${field} is missing`)
                        .end();
                }
            }
            next();
        };
    },
    makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
