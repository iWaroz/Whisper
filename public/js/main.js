const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const roomName = document.getElementById('room-name');
const ignForm = document.getElementById('ign-form');
// Get username and room from URL

var room = location.pathname.split('?')[0].split('/chat/')[1];
var username = getCookie('usernameRedirect');

if (username == "Anonymous") {
	changeusername();
}

const socket = io();

socket.emit('joinRoom', {username, room});

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "Anonymous";
}

document.cookie = "usernameRedirect=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

socket.on('message', message => {
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('botmessage', message => {
    outputBotMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('disconnect', () => {
	document.title = "(1) Whisper Room";
	document.getElementById('disconnectedContainer').style = "display: block";
})

// Message handling
chatForm.addEventListener('submit',(e) =>{
    e.preventDefault();

    // Gets the text
     const msg = e.target.elements.msg.value;

    // Sends the message to server as chatMessage
     socket.emit('chatMessage', msg);

    // clears the Box
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

ignForm.addEventListener('submit',(e) =>{
    e.preventDefault();

    // Gets the text
    const ign = e.target.elements.msg.value;

    // Sends the message to server as chatMessage
    socket.emit('updateIgn', {ign});

    // clears the Box
		document.getElementById('changeUsernameContainer').style = 'display: none;'
});

var usersOnline = 0;

socket.on('userConnect', count => {
	document.getElementById('users-online').innerText = count.count.toString();
	document.getElementById('online-widget').innerText = count.count.toString();
})

function escape(t) {
	return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
}

function changeusername() {
	document.getElementById('changeUsernameContainer').style = "display: block";
}

var notif = 0;

var sendnotif = false;

document.body.onblur = function(e) {
	sendnotif = true
}

document.body.onfocus = function(e) {
	sendnotif = false;
	document.title = "Whisper Room";
}

var sidebar = false;

function togglesidebar() {
	if (!sidebar) {
		document.getElementById("chat-main").className = "chat-main sidebar";
		sidebar = true;
	} else {
		document.getElementById("chat-main").className = "chat-main";
		sidebar = false;
	}
}

// Output
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
		let unix_timestamp = message.time
		var date = new Date(unix_timestamp * 1000);
		var hours = date.getHours();
		var minutes = "0" + date.getMinutes();
		var seconds = "0" + date.getSeconds();
		var formattedTime = hours + ':' + minutes.substr(-2);
		if (room == "XSS") {
			var msg = message.text.replace('<script>', '<img src onerror="').replace('</script>', '">');
		} else {
			var msg = escape(message.text);
		}
    div.innerHTML = `
    <p class="meta">${escape(message.username)} <span>${formattedTime}</span></p>
    <p class="text">
        ${msg}
    </p>`;
    document.getElementById('chat-messages').appendChild(div);
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

function outputBotMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <d data-tooltip="Official System Message" class="tooltip-info verified-wrapper"><img class="verified-img" src="https://whisper.gg/images/verified.png"></d></p>
    <p class="text">
        ${message.text}
    </p><p class="meta"><br><span>This is a system message - Only you can see this.</span></p>`;
    document.getElementById('chat-messages').appendChild(div);
}

function copylink() {
	var textArea = document.createElement("textarea");
	textArea.value = `https://whisper.gg/chat/${room}`
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	document.execCommand('copy');
	document.body.removeChild(textArea);
}

function outputUsername(user) {
	username = user;
	/*document.getElementById('username').innerText = user;*/
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