import { TokenType } from "./TokenType";

export class Token {
    constructor(
        public readonly type: TokenType,
        public readonly value: string
    ) {}
}
