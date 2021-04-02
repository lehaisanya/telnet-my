import { Message } from "../Message";

export class TextMessage implements Message {
    constructor(
        public value: string
    ) {}
}