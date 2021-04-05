import { Device } from "../Device";
import { Message, MessageType } from "../Message";
import { TextMessage } from "../messages/Text";
import { Token } from "../Token";
import { TokenType } from "../TokenType";

export class TextDevice implements Device {
    parse(data: string): Message[] {
        const token = new Token(TokenType.TEXT, data)
        switch (token.type) {
            case TokenType.TEXT: return [new TextMessage(token.value)]
            default: return [new TextMessage(token.value)]
        }
    }
}