import { Message } from "../Message";
import { TextMessage } from "../messages/Text";
import { State } from "../State";
import { Telnet } from "../Telnet";
import { Token } from "../Token";
import { TokenType } from "../TokenType";

export class Command implements State {
    public readonly displayName = 'Command'
    private telnet: Telnet

    constructor(telnet: Telnet) {
        this.telnet = telnet
    }

    read(message: Message): State {
        return this
    }

    write(data: string) {

    }
}