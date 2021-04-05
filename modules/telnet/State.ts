import { Telnet } from "./Telnet";
import { Message } from "./Message";
import { Token } from "./Token";

export interface State {
    displayName: string
    read(message: Message): State
    write(data: string): void
}
