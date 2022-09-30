let mobileToggled = false;

function mobileToggle() {
	if (mobileToggled) {
		document.getElementById('chat-area').style = '';
		document.getElementById('sidebar').style = ''
	} else {
		document.getElementById('chat-area').style = 'display: none';
		document.getElementById('sidebar').style = 'display: block; width: 100%;'
	}
	mobileToggled = !mobileToggled;
}
document.body.onresize = function() {
	if (document.body.clientWidth >= 950 && mobileToggled) {
		document.getElementById('chat-area').style = '';
		document.getElementById('sidebar').style = '';
	} else if (document.body.clientWidth <= 950 && mobileToggled) {
		document.getElementById('chat-area').style = 'display: none';
		document.getElementById('sidebar').style = 'display: block; width: 100%;'
	}
}
function sidebarToggle(elemId) {
	var x = document.getElementById(elemId + "-inner");
	debug(x.style.top === "-100%");
	if (x.style.top === "-100%") {
		x.style.top = "0%";
		x.style.height = null;
		x.style.margin = null;
		document.getElementById("angle-" + elemId).className = "fa-solid fa-angle-up";
	} else {
		x.style.top = "-100%";
		x.style.height = "0px";
		x.style.margin = "0px";
		document.getElementById("angle-" + elemId).className = "fa-solid fa-angle-down";
	}
}

function sentSupport() {
	document.getElementById('sm-inner').innerHTML = "<div style='color: rgba(255,255,255,0.4); font-size: 20px; padding: 10px 0;'>Thanks for your bug report, suggestion, or nice message! Our team will read it and take appropriate action if necessary.</div>";
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

const icons = ["mug-hot", "snowflake", "apple-whole", "atom", "basketball", "biohazard", "bolt", "bomb", "bone", "bug", "candy-cane", "cannabis", "carrot", "cloud", "clover", "code", "compass", "cookie", "cookie-bite", "crow", "crown", "dove", "eye", "fan", "feather", "feather-pointed", "fire", "fire-flame-curved", "fish", "flask", "gear", "ghost", "gift", "heart", "heart-crack", "helicopter", "ice-cream", "leaf", "lemon", "location-arrow", "mask-face", "medal", "microchip", "moon", "mountain", "music", "paw", "plane", "radiation", "recycle", "ribbon", "rocket", "seedling", "shapes", "skull", "spa", "spider", "splotch", "star", "sun", "terminal", "tree", "vial", "virus"]

themes = {
	"blue": "58, 122, 231 | 24, 86, 193",
	"purple": "136, 58, 231 | 100, 24, 193",
	"pink": "225, 58, 231 | 187, 24, 193",
	"red": "231, 58, 58 | 193, 24, 24",
	"orange": "231, 139, 58 | 193, 103, 24",
	"yellow": "230, 208, 67 | 197, 174, 26",
	"green": "86, 196, 59 | 65, 147, 44"
}

let newTheme = getCookie("theme") || "blue";
let currentTheme = "blue";
let auth = getCookie("auth") || "none";
let username = getCookie("username") || null;

debugEnabled = !(auth === "none");

function debug(...args) {
	if (debugEnabled) {
		console.log.apply(console, args);
	}
}

window.onload = () => {
	changeTheme(newTheme);
}

function changeTheme(name) {
	document.cookie = `theme=${name}`
	let light = themes[name].split(' | ')[0]
	let dark = themes[name].split(' | ')[1]

	document.documentElement.style.setProperty('--theme', 'rgb(' + light + ')');
	document.documentElement.style.setProperty('--theme-rgb', light);

	document.documentElement.style.setProperty('--theme-dark', 'rgb(' + dark + ')');
	document.documentElement.style.setProperty('--theme-dark-rgb', dark);

	document.getElementById("theme-" + currentTheme).classList.remove('sidebar-selected');
	document.getElementById("theme-" + name).classList.add('sidebar-selected');
	currentTheme = name;
}

const chatForm = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const roomName = document.getElementById('room-name');
const ignForm = document.getElementById('ign-form');

var urlParams = new URLSearchParams(window.location.search);

var room = location.pathname.split('?')[0].split('/c/')[1];
if (username === null) {
	var names = ["Anonymous", "Unknown", "Nonymous", "Chatter", "Whisperer"];
	username = names[Math.floor(Math.random() * names.length)];
}
	
var color = "";
var icon = "";

if (urlParams.has('u')) {
	let username = urlParams.get('u');
	window.history.replaceState({}, null, `/c/${room}`);
}

const socket = io();

document.getElementById("ign-form").defaultValue = username
socket.emit('joinRoom', { "username": username, "room": room, "auth": auth });

function checkVisible(elm) {
	if (elm === null) {return true}
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

var latestMessage = null;

socket.on('message', message => {
	debug(message);
	outputMessage(message);

	if (checkVisible(latestMessage)) {
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}
})

socket.on('botmessage', message => {
	outputBotMessage(message);

	if (checkVisible(latestMessage)) {
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}
})

socket.on('disconnect', () => {
	debug(color, icon)
	socket.emit('joinRoom', { "username": username, "room": room, "color": color, "icon": icon, "auth": auth });
})

// Message handling
chatForm.addEventListener('keyup', (e) => {
	if (e.keyCode === 13) {
		e.preventDefault();

		// Gets the text
		const msg = e.target.value;

		// Sends the message to server as chatMessage
		socket.emit('chatMessage', msg);

		// clears the Box
		e.target.value = '';
		e.target.focus();
	}
});

function sendMessage() {
	const msg = chatForm.value;

	// Sends the message to server as chatMessage
	socket.emit('chatMessage', msg);

	// clears the Box
	chatForm.value = '';
	chatForm.focus();
}

ignForm.addEventListener('change', (e) => {
	e.preventDefault();

	// Gets the text
	username = e.target.value;
	document.cookie = "username=" + username;

	socket.emit('updateIgn', { "ign": username });
});

socket.on('userState', state => {
	color = state.color;
	icon = state.icon;
	debug('user state updated!', color, icon);
})

var usersOnline = 0;

socket.on('userConnect', count => {
	document.getElementById('users-online').innerText = count.count.toString();
})

function escape(t) {
	t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
	return t;
}

const emotes = ["love", "dab", "gangsta"]

function emojify(t, color) {
	for (const em of emotes) {
		t = t.split(`:${em}:`).join(`</span><span class="tooltip" data-tooltip=":${em}:" style="--color: ${color}; color: ${color};"><img src="../images/emote/${em}.png" style="height: 20px; width: 20px;"/></span><span class="message-inner">`);
	}
	for (const em of icons) {
		t = t.split(`:${em}:`).join(`</span><span class="tooltip" data-tooltip=":${em}:" style="--color: ${color}; color: ${color}; position: absolute;"><i class="fa-solid fa-${em}" style="font-size: 20px; margin: 0px; height: 0;"></i></span><span>&nbsp;&nbsp;&nbsp;</span><span class="message-inner">`)
	}
	return t;
}

function markdown(t) {
	t = t.replace(/\*\*.+?\*\*/g, function (match, offset, string) {
		return "<b>" + match.slice(2, -2) + "</b>"
	});
	t = t.replace(/\*.+?\*/g, function (match, offset, string) {
		return "<span style='font-style: italic;'>" + match.slice(1, -1) + "</span>"
	});
	t = t.replace(/__.+?__/g, function (match, offset, string) {
		return "<span style='text-decoration: underline;'>" + match.slice(2, -2) + "</span>"
	});
	t = t.replace(/\$.+?\$/g, function (match, offset, string) {
		return "<span style='color: var(--theme)'>" + match.slice(1, -1) + "</span>"
	});
	return t;
}

var notif = 0;

var sendnotif = false;

document.body.onblur = function(e) {
	sendnotif = true
}

document.body.onfocus = function(e) {
	sendnotif = false;
	document.title = "Whisper Room";
	notif = 0;
}

function urlify(text) {
	var urlRegex = /(https?:\/\/[^\s]+)/g;
	return text.replace(urlRegex, function(url) {
		return '<a href="' + url + '" target="_blank">' + url + '</a>';
	})
}

// Output
function outputMessage(message) {
	debug('outputting', message)
	const div = document.createElement('div');
	div.classList.add('message');
	let unix_timestamp = message.time
	var date = new Date(unix_timestamp * 1000);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var formattedTime = hours + ':' + minutes.substr(-2);
	var msg = markdown(escape(message.text));
	if (!message.color.match(/\d{1,3}, ?\d{1,3}, ?\d{1,3}/)) {
		message.color = "58, 122, 231";
	}
	var color = `rgba(${escape(message.color)})`;
	console.log("valid color:", color);
	msg = emojify(msg, color);
	var badge = '';
	if (message.isDev) {
		//badge = `<span class="tooltip-wrapper" style="position: absolute"><span class="tooltip badgetooltip" data-tooltip="Developer of Whisper" style="position: absolute; --color: ${color}; color: var(--color); margin: 0 5px;"><i class="fa-solid fa-code" style="font-size: 20px; margin: 0px; height: 0;"></i></span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span><!--<span class="empty4badge" style="margin-right: 25px;">--></span>`
		badge = `<span class="tooltip-wrapper" style="marg"><span class="tooltip" data-tooltip="Developer of Whisper" style="--color: ${color}; color: var(--color);"><i class="fa-solid fa-code" style="font-size: 15px; margin: 0px; height: 0;"></i></span></span>`
	}
	var icon = message.icon;
	msg = urlify(msg);
	div.innerHTML = `
	<div class="message">
		<i class="fa-solid fa-${icon}" style="color: ${color}"></i>
		<div class="message-text">
			<div class="message-name">
				<span class="message-author" style="color: ${color}">${escape(message.username)}</span>
				${badge}
				<span class="message-time">${formattedTime}</span>
			</div>
			<div class="message-content">
				<span class="message-inner">${msg}</span>
			</div>
		</div>
	</div>`;
	document.getElementById('chat-messages').appendChild(div);
	latestMessage = div;
	if (sendnotif) {
		notif++;
		if (notif > 0) {
			var notifstr = "(" + notif.toString() + ") "
		} else {
			var notifstr = ""
		}
		document.title = notifstr + "Whisper Room"
	}
}

function outputBotMessage(message) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `
	<div class="message">
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="30" height="30" viewBox="0 0 218 218" xml:space="preserve" style="margin: 9px">
<g transform="matrix(1.56 0 0 1.56 109 109)" id="aa685d30-defc-42fa-80c0-09270ae8506f">
<path style="stroke: color: rgba(100, 181, 246, 90); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgba(100, 181, 246, 90); fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke" transform=" translate(-104.66, -108.11)" d="M 88.18 120.63 C 84.36 127.6 80.96 133.48 77.87 139.52 C 71.95 151.12 74.3 161.13 84.71 169.31 C 86.21 170.49 87.83 171.46 86.51 173.66 C 85.16 175.93 83.34 174.65 81.71 174.11 C 59.5 166.64 48.07 145.42 53.78 122.18 C 56.02 113.08 59.55 104.53 65.31 97.05 C 77.2 81.59 85.66 64.5 90.11 45.47 C 91.23 40.67 93.5 39.86 96.96 43.63 C 111.03 58.98 127.09 72.59 139.18 89.65 C 148.96 103.46 157.12 118.1 156.99 136.11 C 156.82 158.58 135.24 172.11 119.39 174.67 C 117.85 174.92 116.7 174.89 115.96 173.47 C 115.38 172.36 115.72 171.27 116.45 170.32 C 116.72 169.96 117.03 169.62 117.37 169.31 C 136.32 152.36 133.66 131.78 121.03 110.87 C 118.6 106.85 116.17 102.8 112 98.87 C 108.88 109.58 106.47 119.65 102.48 129.18 C 101.87 130.64 101.29 132.12 100.69 133.59 C 100.01 135.22 99.72 137.42 97.34 137.24 C 95.09 137.07 94.63 135.07 94.33 133.25 C 93.57 128.69 91.45 124.87 88.18 120.63 z" stroke-linecap="round"/>
</g>
</svg>
		<div class="message-text">
			<div class="message-name">
				<span class="message-author" style="color: rgba(100, 181, 246, 90)">Whisper&nbsp;<span class="tooltip" data-tooltip="Official System Message" style="--color: rgba(100, 181, 246, 90); color: var(--color);"><i class="fa-solid fa-circle-check" style="font-size: 15px; margin: 0px; height: 0;"></i></span></span>
			</div>
			<div class="message-content">
				<span class="message-inner">${message.text}</span>
				<div style="color: rgba(255,255,255,0.2); margin-top: 5px;">System Message - Only you can see this</div>
			</div>
		</div>
	</div>`;
	document.getElementById('chat-messages').appendChild(div);
	latestMessage = div;

	if (debugEnabled) {
		outputMessage({
	    "username": "System",
	    "text": "This is a pretty :fire: test message because debug is enabled.",
	    "time": 1646339100,
	    "color": "132, 100, 246",
	    "icon": "terminal",
	    "isDev": true
	})
	}
}

function outputUsername(user) {
	username = user;
}

function outputRoomName(room) {
	return;
}

function togglemenu(evt, cityName) {
	var i, tabcontent, tablinks;

	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	document.getElementById(cityName).style.display = "block";
	evt.currentTarget.className += " active";
}
