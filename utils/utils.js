function makeid(length) {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

function randomColor() {
		let colors = [
			"246, 100, 100", // red
			"246, 122, 100", // crimson
			"246, 144, 100", // light orange
			"246, 180, 100", // peach
			"246, 214, 100", // orange yellow
			"246, 236, 100", // yellow
			"227, 246, 100", // lime yellow
			"188, 246, 100", // lime
			"149, 246, 100", // darker lime
			"117, 246, 100", // green
			"100, 246, 129", // green cyan
			"100, 246, 173", // cyan
			"100, 246, 219", // aqua
			"100, 222, 246", // dark aqua
			"100, 188, 246", // light blue
			"100, 151, 246", // lightish blue
			"100, 112, 246", // blue
			"132, 100, 246", // blue purple
			"166, 100, 246", // purple
			"202, 100, 246", // purplish pink
			"246, 100, 246", // magenta
			"246, 100, 207", // fuschia
			"246, 100, 173", // pink
			"246, 100, 139", // reddish pink
		]
		return colors[Math.floor(Math.random()*colors.length)];
}

function randomIcon() {
	const icons = ["mug-hot", "snowflake", "apple-whole", "atom", "basketball", "biohazard", "bolt", "bomb", "bone", "bug", "candy-cane", "cannabis", "carrot", "cloud", "clover", "code", "compass", "cookie", "cookie-bite", "crow", "crown", "dove", "eye", "fan", "feather", "feather-pointed", "fire", "fire-flame-curved", "fish", "flask", "gear", "ghost", "gift", "heart", "heart-crack", "helicopter", "ice-cream", "leaf", "lemon", "location-arrow", "mask-face", "medal", "microchip", "moon", "mountain", "music", "paw", "plane", "radiation", "recycle", "ribbon", "rocket", "seedling", "shapes", "skull", "spa", "spider", "splotch", "star", "sun", "terminal", "tree", "vial", "virus"]
	return icons[Math.floor(Math.random()*icons.length)];
}


module.exports =  {makeid, randomColor, randomIcon}