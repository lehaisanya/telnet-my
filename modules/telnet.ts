import { Socket, createConnection } from 'net'

const regexps = {
    login: /(Username)|(User name)|(login)\:/gim,
    password: /(Password)|(>>User password)\:/gim,
    guest: /^[^>]*>$/gim,
    enable: /^[^#]*#$/gim,
    more: /More/gim
}

export class Telnet {
    private state: TelnetState
    private host: string
    private port: number
    private device: TelnetDevice
    private socket: Socket

    constructor() {

        this.socket = createConnection(this.port, this.host, () => {
            this.socket.setEncoding('utf-8')

        })
    }

    read() {}
    write() {}
}

interface TelnetState {
    read(): void
    write(): void
}

interface TelnetDevice {
    read(): void
    write(): void
}