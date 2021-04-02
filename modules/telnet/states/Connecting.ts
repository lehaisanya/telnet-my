import { Message } from "../Message";
import { TextMessage } from "../messages/Text";
import { State } from "../State";
import { Telnet } from "../Telnet";
import { Token } from "../Token";
import { TokenType } from "../TokenType";

export class Connecting implements State {
    public displayName = 'Connecting'
    private telnet: Telnet

    constructor(telnet: Telnet) {
        this.telnet = telnet
    }

    read(tokens: Token[]): Message[] {
        return tokens.map(token => new TextMessage(`<${TokenType[token.type]} "${token.value}">`))
    }

    write(data: string) {

    }
}