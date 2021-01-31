function formatMessage(username, text) {
	  text.replace('<', '&lt;');
    return{
        username,
        text,
        time: Math.floor(Date.now() / 1000)
    }
}
module.exports = formatMessage;