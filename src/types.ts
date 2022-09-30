import type { Server, IncomingMessage, ServerResponse } from 'http';

export type User = {
    id: string
    username: string
    room: string
    color: string
    icon: string
    isDev: boolean
}

export type Message = {
    username: string
    text: string
    time: number
    color: string
    icon: string
    isDev: boolean
}

export type WhisperSocket = Server<typeof IncomingMessage, typeof ServerResponse>

export type updateIgnRequest = {
	ign: string
}

export type adminUpdateRequest = {
    id?: string
    username?: string
    room?: string
    color?: string
    icon?: string
    isDev?: boolean
}

export type joinRoomRequest = {
    username: string
    room: string
    color: string | null
    icon: string | null
    auth: string | null
}
