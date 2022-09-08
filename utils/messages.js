module.exports = {
    formatMessage(username, text, color, icon, isDev) {
        text.replace('<', '&lt;');
        return {
            username,
            text,
            time: Math.floor(Date.now() / 1000),
						color,
						icon,
						isDev
        }
    }
}