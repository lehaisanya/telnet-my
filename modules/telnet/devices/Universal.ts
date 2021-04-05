import { Device } from "../Device";
import { Message } from "../Message";
import { TextMessage } from "../messages/Text";
import { Token } from "../Token";
import { TokenType } from "../TokenType";

export class UniversalDevice implements Device {

    parse(data: string): Message[] {
        return [new TextMessage(data)]
    }
}