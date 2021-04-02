import { Telnet } from "./Telnet";
import { Message } from "./Message";
import { Token } from "./Token";

export interface State {
    constructor(telnet: Telnet): State // ?
    displayName: string
    read(tokens: Token[]): Message[]
    write(data: string): void
}
