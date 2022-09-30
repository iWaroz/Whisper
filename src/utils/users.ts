import { User } from "../types";

const users: User[] = [];

// Rooms
export const userJoin = (id: string, username: string, room: string, color: string, icon: string, isDev: boolean) => {
    const user = { id, username, room, color, icon, isDev }
    users.push(user);
    return user;
}

export const getCurrentUser = (id: string) => {
    return users.find(user => user.id === id);
}
