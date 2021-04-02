import { Device } from "../Device";
import { Token } from "../Token";
import { TokenType } from "../TokenType";

export class UniversalDevice implements Device {
    parse(data: string): Token[] {
        return [new Token(TokenType.TEXT, data)]
    }
}