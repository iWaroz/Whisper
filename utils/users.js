const users = [];

// Rooms
function userJoin(id, username, room, color, icon, isDev) {
    const user = { id, username, room, color, icon, isDev }

    users.push(user);

    return user;
}

function getCurrentUser(id){
    return users.find(user => user.id === id);
}
module.exports = {
    userJoin,
    getCurrentUser
};