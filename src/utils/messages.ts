import type { Message } from '../types'

export default (username: string, text: string, color: string, icon: string, isDev: boolean): Message => {
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
